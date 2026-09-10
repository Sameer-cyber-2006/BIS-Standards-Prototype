package com.example.bisassistant.model;

import java.util.List;

/** One ranked, matched scheme returned by the eligibility engine. */
public record SchemeMatchResult(
        String schemeId,
        String schemeName,
        String department,
        String whyRelevant,
        String eligibilityStatus,   // Eligible / Partially Matched / Not Matched
        int relevanceScore,
        List<String> matchedCriteria,
        List<String> unmatchedCriteria,
        String benefits
) {}
