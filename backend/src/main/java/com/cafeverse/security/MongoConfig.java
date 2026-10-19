package com.cafeverse.security;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MongoConfig {

    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(
                "mongodb+srv://aarthi32:Aarthi32@cluster0.grrieqs.mongodb.net/cafeverse?retryWrites=true&w=majority&appName=Cluster0"
        );
    }
}
