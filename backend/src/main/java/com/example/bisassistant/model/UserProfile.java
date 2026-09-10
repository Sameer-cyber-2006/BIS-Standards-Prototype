package com.example.bisassistant.model;

/** A user's business/consumer profile, used to personalise the Government Schemes Finder. */
public record UserProfile(
        String id,
        String name,
        String email,
        String phone,
        String organization,
        String userType,        // Industry / MSME / Startup / Consumer / Other
        String sector,          // e.g. Manufacturing, Services, Agro-based
        String businessType,    // e.g. Manufacturing (MSME), Trading, Services
        String state,
        String city,
        String businessSize,    // Micro / Small / Medium / Large / Not Applicable
        String turnover,        // optional, free text
        String yearsInBusiness, // optional, free text
        String productOrService,
        String purpose          // primary requirement/purpose
) {}
