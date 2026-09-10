package com.example.bisassistant.model;

/** Response for GET /api/auth/status - lets the frontend check session state on load. */
public record AuthStatus(boolean authenticated, UserProfile profile) {}
