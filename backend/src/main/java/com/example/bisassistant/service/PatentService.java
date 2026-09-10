package com.example.bisassistant.service;

import com.example.bisassistant.model.PatentGuidance;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * PROTOTYPE - always returns the same illustrative guidance. No real patent
 * database or search API is queried, and no legal advice is given.
 */
@Service
public class PatentService {

    public PatentGuidance getGuidance(String description) {
        return new PatentGuidance(
                "Preliminary AI-Based Guidance",
                List.of(
                        "Novelty should be evaluated",
                        "Existing patents should be searched",
                        "Technical documentation should be maintained"
                ),
                "This is preliminary guidance and is not legal advice or a patentability determination."
        );
    }
}
