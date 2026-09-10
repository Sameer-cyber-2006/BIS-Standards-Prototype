package com.example.bisassistant.model;

/** Mock AI response returned by the BIS Standard Assistant. */
public record AssistantResponse(
        String productIdentified,
        String standardNumber,
        String standardTitle,
        int relevanceScore,
        String reason,
        String status
) {}
