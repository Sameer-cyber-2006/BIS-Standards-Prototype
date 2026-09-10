package com.example.bisassistant.service;

import com.example.bisassistant.model.AuthResponse;
import com.example.bisassistant.model.LoginRequest;
import com.example.bisassistant.model.RegisterRequest;
import com.example.bisassistant.model.UserProfile;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * PROTOTYPE authentication - a single in-memory account store and a single
 * "current session" (no JWT/cookies, no password hashing, no multi-device
 * sessions). This is intentionally simple: good enough to demonstrate that
 * the User Profile is gated behind login/registration, without building a
 * production auth system. Restarting the backend clears all accounts.
 *
 * A demo account (demo@example.com / demo1234) is pre-seeded so the app can
 * be demoed quickly without registering first.
 */
@Service
public class AuthService {

    private record Account(String password, UserProfile profile) {}

    private final Map<String, Account> accounts = new LinkedHashMap<>();
    private final AtomicInteger nextId = new AtomicInteger(2);
    private volatile String currentEmail; // null = logged out

    public AuthService() {
        UserProfile demo = new UserProfile(
                "1", "Demo User", "demo@example.com", "9876543210",
                "Sample Industries Pvt. Ltd.", "MSME", "Manufacturing",
                "Manufacturing (MSME)", "Maharashtra", "Pune",
                "Small", "", "", "Industrial water storage tanks", "Business Expansion"
        );
        accounts.put("demo@example.com", new Account("demo1234", demo));
    }

    public boolean isAuthenticated() {
        return currentEmail != null;
    }

    public AuthResponse register(RegisterRequest r) {
        if (r.name() == null || r.name().isBlank()) throw new IllegalArgumentException("Full Name is required.");
        if (r.email() == null || r.email().isBlank()) throw new IllegalArgumentException("Email is required.");
        if (r.password() == null || r.password().length() < 4) throw new IllegalArgumentException("Password must be at least 4 characters.");
        String email = r.email().trim().toLowerCase();
        if (accounts.containsKey(email)) throw new IllegalArgumentException("An account with this email already exists.");

        UserProfile profile = new UserProfile(
                String.valueOf(nextId.getAndIncrement()), r.name(), r.email(), r.phone(),
                r.organization(), r.userType(), r.sector(), r.businessType(), r.state(), r.city(),
                r.businessSize(), r.turnover(), r.yearsInBusiness(), r.productOrService(), r.purpose()
        );
        accounts.put(email, new Account(r.password(), profile));
        // Registration only creates the account. Authentication starts only
        // after the user explicitly logs in.
        return new AuthResponse(false, "Registered successfully. Please log in to continue.", profile);
    }

    public AuthResponse login(LoginRequest r) {
        if (r.email() == null || r.password() == null) {
            throw new IllegalArgumentException("Email and password are required.");
        }
        String email = r.email().trim().toLowerCase();
        Account account = accounts.get(email);
        if (account == null || !account.password().equals(r.password())) {
            throw new IllegalArgumentException("Incorrect email or password.");
        }
        currentEmail = email;
        return new AuthResponse(true, "Logged in successfully.", account.profile());
    }

    public void logout() {
        currentEmail = null;
    }

    public UserProfile currentProfile() {
        requireLoggedIn();
        return accounts.get(currentEmail).profile();
    }

    public UserProfile updateCurrentProfile(UserProfile updated) {
        requireLoggedIn();
        if (updated.name() == null || updated.name().isBlank()) throw new IllegalArgumentException("Full Name is required.");
        if (updated.email() == null || updated.email().isBlank()) throw new IllegalArgumentException("Email is required.");

        Account existing = accounts.get(currentEmail);
        UserProfile withId = new UserProfile(
                existing.profile().id(), updated.name(), updated.email(), updated.phone(),
                updated.organization(), updated.userType(), updated.sector(),
                updated.businessType(), updated.state(), updated.city(),
                updated.businessSize(), updated.turnover(), updated.yearsInBusiness(),
                updated.productOrService(), updated.purpose()
        );
        accounts.put(currentEmail, new Account(existing.password(), withId));
        return withId;
    }

    private void requireLoggedIn() {
        if (currentEmail == null) {
            throw new IllegalStateException("Not logged in. Please log in to view or edit your profile.");
        }
    }
}
