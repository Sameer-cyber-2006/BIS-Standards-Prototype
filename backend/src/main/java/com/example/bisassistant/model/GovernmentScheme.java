package com.example.bisassistant.model;

import java.util.List;

/** One entry in the mock Government Schemes knowledge base. */
public record GovernmentScheme(
        String id,
        String schemeName,
        String department,
        String targetBeneficiaries,
        String sector,
        String location,
        List<String> eligibilityCriteria,
        String benefits,
        List<String> requiredDocuments,
        String applicationInfo
) {}
