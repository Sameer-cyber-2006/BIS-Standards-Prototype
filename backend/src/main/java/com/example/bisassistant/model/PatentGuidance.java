package com.example.bisassistant.model;

import java.util.List;

/** Simulated, preliminary patent guidance - not legal advice. */
public record PatentGuidance(
        String type,
        List<String> considerations,
        String disclaimer
) {}
