package com.cafeverse.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    private String menuItemId;
    private String name;
    private int quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;
}
