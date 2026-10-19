package com.cafeverse.controller;

import com.cafeverse.service.GeminiService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai-barista")
public class AiBaristaController {

    private final GeminiService geminiService;

    public AiBaristaController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/chat")
    public Map<String, String> chat(
            @RequestBody Map<String, String> request) {


        long start = System.nanoTime();

        System.out.println("➡️ AI chat controller started");


        String message = request.get("message");

        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException(
                    "Message cannot be empty");
        }

        String reply = geminiService.chat(message);
        System.out.println(
                "⏱️ Controller total: "
                        + (System.nanoTime() - start) / 1_000_000_000.0
                        + " seconds"
        );


        return Map.of("reply", reply);
    }
}