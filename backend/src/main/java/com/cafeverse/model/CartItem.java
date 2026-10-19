package com.cafeverse.model;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "cartItems")
public class CartItem {

    private String menuItemId;

    private String name;

    private BigDecimal price;

    private int quantity;

    private String imageUrl;

    private BigDecimal subtotal;
}
