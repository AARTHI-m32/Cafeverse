package com.cafeverse.controller;

import com.cafeverse.dto.request.AddToCartRequest;
import com.cafeverse.dto.request.UpdateQuantityRequest;
import com.cafeverse.model.Cart;
import com.cafeverse.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public Cart addToCart(@RequestBody AddToCartRequest request) {
        return cartService.addToCart(request);
    }

    @GetMapping
    public Cart getCart() {
        return cartService.getCart();
    }

    @PutMapping("/update/{menuItemId}")
    public Cart updateQuantity(
            @PathVariable String menuItemId,
            @RequestBody UpdateQuantityRequest request
    ) {
        return cartService.updateQuantity(menuItemId, request.getQuantity());
    }

    @DeleteMapping("/remove/{menuItemId}")
    public Cart removeItem(@PathVariable String menuItemId) {
        return cartService.removeItem(menuItemId);
    }

    @DeleteMapping("/clear")
    public String clearCart() {
        cartService.clearCart();
        return "Cart cleared successfully";
    }
}