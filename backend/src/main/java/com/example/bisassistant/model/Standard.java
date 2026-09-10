package com.example.bisassistant.model;

import java.util.List;

/** A single entry in the mock BIS knowledge base. */
public record Standard(
        String id,
        String standardNumber,
        String title,
        String scope,
        String applicability,
        List<String> keyRequirements,
        String status
) {}
