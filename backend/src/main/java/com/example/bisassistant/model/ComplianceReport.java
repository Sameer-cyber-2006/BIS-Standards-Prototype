package com.example.bisassistant.model;

import java.util.List;

/** Structured compliance report data returned to the frontend for preview/"download". */
public record ComplianceReport(
        String reportId,
        String generatedDate,
        String product,
        String material,
        String capacity,
        String application,
        String recommendedStandard,
        String standardTitle,
        int relevanceScore,
        List<String> matchedRequirements,
        List<String> potentialGaps,
        String explanation,
        String sources,
        String disclaimer,
        String status
) {}
