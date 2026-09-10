package com.example.bisassistant.model;

import java.util.List;

/** Requirements extracted from a procurement document (mocked - no real parsing occurs). */
public record ProcurementRequirement(
        String product,
        String material,
        String capacity,
        String application,
        List<String> technicalRequirements
) {}
