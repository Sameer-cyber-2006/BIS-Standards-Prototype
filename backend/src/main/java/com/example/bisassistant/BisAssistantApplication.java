package com.example.bisassistant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * SIH26107 - BIS Assistant backend prototype.
 *
 * This is a PROTOTYPE for Smart India Hackathon demonstration purposes only.
 * All AI, BIS, patent and government scheme responses are produced by mock services using
 * predefined demo data - there are no real Gemini/BIS/patent/bank API calls,
 * no OCR, and no database. See each service class for the mock logic.
 */
@SpringBootApplication
public class BisAssistantApplication {
    public static void main(String[] args) {
        SpringApplication.run(BisAssistantApplication.class, args);
    }
}
