package com.cafeverse.service;

import com.google.genai.Client;
import com.google.genai.gaos.models.interactions.ThinkingLevel;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.ThinkingConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final Client client;

    public GeminiService(
            @Value("${gemini.api.key}") String apiKey) {
        this.client = Client.builder()
                .apiKey(apiKey)
                .build();
    }

    public String chat(String message) {

        long start = System.nanoTime();

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3.8-flash",
                        "You are the friendly AI Barista for CafeVerse. "
                                + "Be helpful and concise. "
                                + "Customer message: " + message,
                        null
                );

        long elapsed = (System.nanoTime() - start) / 1_000_000_000;

        System.out.println("Gemini API took " + elapsed + " seconds");

        return response.text();
    }
}