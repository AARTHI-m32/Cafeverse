package com.cafeverse.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "menuItems")
public class MenuItem {
    @Id
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private String imageUrl;
    private List<String> ingredients;
    private Boolean isVegetarian;
    private Integer preparationTimeMinutes;
    
    @Builder.Default
    private boolean isAvailable = true;
    @Builder.Default
    private double rating = 0.0;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
