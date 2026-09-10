package com.example.bisassistant.model;

/** Response for register/login - never includes the password. */
public record AuthResponse(boolean success, String message, UserProfile profile) {}
