package com.example.bisassistant.model;

import java.util.List;

/** Request body for POST /api/explanation */
public record ExplanationRequest(
        String product,
        String standardNumber,
        List<String> matchedRequirements,
        String potentialGap
) {}
