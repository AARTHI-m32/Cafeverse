package com.cafeverse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DatabaseInfoController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/api/db-info")
    public String dbName() {
        return "Connected DB: " + mongoTemplate.getDb().getName();
    }
}