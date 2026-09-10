package com.example.bisassistant.service;

import com.example.bisassistant.model.AssistantResponse;
import org.springframework.stereotype.Service;

/**
 * PROTOTYPE ONLY - simulates what the Gemini-powered BIS Assistant will do
 * in production. Uses simple keyword matching against a few demo products
 * instead of a real AI model or verified BIS knowledge base.
 */
@Service
public class AssistantService {

    public AssistantResponse answerQuery(String query) {
        String q = query == null ? "" : query.toLowerCase();

        if (q.contains("tank")) {
            return new AssistantResponse(
                    "Industrial Water Tank",
                    "IS 12701 : 1996",
                    "Polyethylene Water Storage Tanks - Specification",
                    92,
                    "The product category, material and intended use are relevant to this standard.",
                    "Result"
            );
        }
        if (q.contains("helmet")) {
            return new AssistantResponse(
                    "Industrial Safety Helmet",
                    "IS 2925 : 1984",
                    "Industrial Safety Helmets - Specification",
                    88,
                    "The product category and intended protective use match the scope of this standard.",
                    "Result"
            );
        }
        // Default demo case matches the example in the brief: stainless steel water bottle
        return new AssistantResponse(
                "Stainless Steel Water Bottle",
                "IS 17482 : 2021",
                "Stainless Steel Water Containers - Standard Specification",
                92,
                "The product category, material and intended use are relevant to this standard.",
                "Result"
        );
    }
}
