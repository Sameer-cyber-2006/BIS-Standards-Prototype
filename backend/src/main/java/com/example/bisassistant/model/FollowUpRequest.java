package com.example.bisassistant.model;

/** Request body for POST /api/explanation/followup - a follow-up chat question. */
public record FollowUpRequest(String question, String standardNumber) {}
