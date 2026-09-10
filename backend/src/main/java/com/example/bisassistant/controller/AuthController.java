package com.example.bisassistant.controller;

import com.example.bisassistant.model.AuthResponse;
import com.example.bisassistant.model.AuthStatus;
import com.example.bisassistant.model.LoginRequest;
import com.example.bisassistant.model.RegisterRequest;
import com.example.bisassistant.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /** POST /api/auth/register - create a new prototype account; login is a separate step. */
    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    /** POST /api/auth/login */
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    /** POST /api/auth/logout */
    @PostMapping("/logout")
    public void logout() {
        authService.logout();
    }

    /** GET /api/auth/status - lets the frontend check session state without triggering a 401. */
    @GetMapping("/status")
    public AuthStatus status() {
        if (!authService.isAuthenticated()) return new AuthStatus(false, null);
        return new AuthStatus(true, authService.currentProfile());
    }
}
