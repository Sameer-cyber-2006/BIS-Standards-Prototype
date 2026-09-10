package com.example.bisassistant.model;

/** Request body for POST /api/schemes/eligibility - the profile fields used for matching. */
public record SchemeEligibilityRequest(
        String userType,
        String sector,
        String state,
        String businessSize,
        String turnover,
        String purpose
) {}
