package com.cafeverse.service;


import com.cafeverse.dto.request.AddToCartRequest;
import com.cafeverse.model.Cart;
import com.cafeverse.model.CartItem;
import com.cafeverse.model.MenuItem;
import com.cafeverse.model.User;
import com.cafeverse.repository.CartRepository;
import com.cafeverse.repository.MenuItemRepository;
import com.cafeverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Cart addToCart(AddToCartRequest request) {

        User user = getCurrentUser();

        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElse(
                        Cart.builder()
                                .userId(user.getId())
                                .items(new ArrayList<>())
                                .totalPrice(BigDecimal.ZERO)
                                .build()
                );

        Optional<CartItem> existingItem = cart.getItems()
                .stream()
                .filter(item -> item.getMenuItemId().equals(menuItem.getId()))
                .findFirst();

        if (existingItem.isPresent()) {

            CartItem item = existingItem.get();

            item.setQuantity(item.getQuantity() + request.getQuantity());

            item.setSubtotal(
                    item.getPrice()
                            .multiply(BigDecimal.valueOf(item.getQuantity()))
            );

        } else {

            CartItem cartItem = CartItem.builder()
                    .menuItemId(menuItem.getId())
                    .name(menuItem.getName())
                    .price(menuItem.getPrice())
                    .quantity(request.getQuantity())
                    .imageUrl(menuItem.getImageUrl())
                    .subtotal(
                            menuItem.getPrice()
                                    .multiply(BigDecimal.valueOf(request.getQuantity()))
                    )
                    .build();

            cart.getItems().add(cartItem);
        }

        updateTotal(cart);

        return cartRepository.save(cart);
    }

    public Cart getCart() {

        User user = getCurrentUser();

        return cartRepository.findByUserId(user.getId())
                .orElse(
                        Cart.builder()
                                .userId(user.getId())
                                .items(new ArrayList<>())
                                .totalPrice(BigDecimal.ZERO)
                                .build()
                );
    }

    public Cart updateQuantity(String menuItemId, int quantity) {

        User user = getCurrentUser();

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().forEach(item -> {

            if (item.getMenuItemId().equals(menuItemId)) {

                item.setQuantity(quantity);

                item.setSubtotal(
                        item.getPrice()
                                .multiply(BigDecimal.valueOf(quantity))
                );
            }
        });

        updateTotal(cart);

        return cartRepository.save(cart);
    }

    public Cart removeItem(String menuItemId) {

        User user = getCurrentUser();

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().removeIf(
                item -> item.getMenuItemId().equals(menuItemId)
        );

        updateTotal(cart);

        return cartRepository.save(cart);
    }

    public void clearCart() {

        User user = getCurrentUser();

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.setItems(new ArrayList<>());

        cart.setTotalPrice(BigDecimal.ZERO);

        cartRepository.save(cart);
    }

    private void updateTotal(Cart cart) {

        BigDecimal total = cart.getItems()
                .stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalPrice(total);
    }
}