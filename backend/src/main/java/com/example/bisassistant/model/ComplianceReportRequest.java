package com.example.bisassistant.model;

import java.util.List;

/** Request body for POST /api/reports/generate */
public record ComplianceReportRequest(
        String product,
        String material,
        String capacity,
        String application,
        String recommendedStandard,
        String standardTitle,
        int relevanceScore,
        List<String> matchedRequirements,
        List<String> potentialGaps,
        String explanation
) {}
