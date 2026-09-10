package com.example.bisassistant.controller;

import com.example.bisassistant.model.UserProfile;
import com.example.bisassistant.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final AuthService authService;

    public ProfileController(AuthService authService) {
        this.authService = authService;
    }

    /** GET /api/profile - the logged-in user's profile. 401 if not logged in. */
    @GetMapping
    public UserProfile getProfile() {
        return authService.currentProfile();
    }

    /** PUT /api/profile - update the logged-in user's profile; applies app-wide immediately. */
    @PutMapping
    public UserProfile updateProfile(@RequestBody UserProfile profile) {
        return authService.updateCurrentProfile(profile);
    }
}
