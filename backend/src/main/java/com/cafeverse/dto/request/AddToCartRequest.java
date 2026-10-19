package com.cafeverse.dto.request;

import lombok.Data;

@Data
public class AddToCartRequest {

    private String menuItemId;
    private int quantity;
}