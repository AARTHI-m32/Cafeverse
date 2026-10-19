package com.cafeverse.repository;

import com.cafeverse.model.Cart;
import com.cafeverse.model.CartItem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CartRepository extends MongoRepository<Cart, String> {


    Optional<Cart> findByUserId(String userId);
}
