package com.example.bisassistant.model;

/** Request body for POST /api/auth/register - creates a new prototype account + profile. */
public record RegisterRequest(
        String name,
        String email,
        String password,
        String phone,
        String organization,
        String userType,
        String sector,
        String businessType,
        String state,
        String city,
        String businessSize,
        String turnover,
        String yearsInBusiness,
        String productOrService,
        String purpose
) {}
