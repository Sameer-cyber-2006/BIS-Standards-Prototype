package com.example.bisassistant.model;

import java.util.List;

/** Simulated AI-generated explanation of why a standard is relevant. */
public record ExplanationResponse(
        String summary,
        List<String> matchedRequirements,
        List<String> potentialGaps,
        String simpleExplanation,
        String status
) {}
