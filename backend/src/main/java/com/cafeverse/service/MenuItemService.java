package com.cafeverse.service;

import com.cafeverse.model.MenuItem;
import com.cafeverse.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;

    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    public MenuItem getMenuItemById(String id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
    }

    public List<MenuItem> getMenuItemsByCategory(String category) {
        return menuItemRepository.findByCategory(category);
    }

    public List<MenuItem> searchMenuItems(String name) {
        return menuItemRepository.findByNameContainingIgnoreCase(name);
    }

    public MenuItem createMenuItem(MenuItem menuItem) {
        menuItem.setCreatedAt(LocalDateTime.now());
        return menuItemRepository.save(menuItem);
    }

    public List<MenuItem> createMenuItems(List<MenuItem> menuItem) {
        menuItem.forEach(item ->
                item.setCreatedAt(LocalDateTime.now())
        );

        return menuItemRepository.saveAll(menuItem);

    }

    public MenuItem updateMenuItem(String id, MenuItem menuItemDetails) {
        MenuItem menuItem = getMenuItemById(id);
        
        menuItem.setName(menuItemDetails.getName());
        menuItem.setDescription(menuItemDetails.getDescription());
        menuItem.setPrice(menuItemDetails.getPrice());
        menuItem.setCategory(menuItemDetails.getCategory());
        menuItem.setImageUrl(menuItemDetails.getImageUrl());
        menuItem.setAvailable(menuItemDetails.isAvailable());
        
        return menuItemRepository.save(menuItem);
    }

    public void deleteMenuItem(String id) {
        MenuItem menuItem = getMenuItemById(id);
        menuItemRepository.delete(menuItem);
    }
}
