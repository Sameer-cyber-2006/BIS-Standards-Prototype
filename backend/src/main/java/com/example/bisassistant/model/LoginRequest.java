package com.example.bisassistant.model;

/** Request body for POST /api/auth/login */
public record LoginRequest(String email, String password) {}
