package com.example.bisassistant.model;

import java.util.List;

/** One ranked result returned by the prototype Standard Matching Engine. */
public record MatchingResult(
        int rank,
        String standardId,
        String standardNumber,
        String title,
        int relevanceScore,
        List<String> matchedRequirements,
        String potentialGap
) {}
