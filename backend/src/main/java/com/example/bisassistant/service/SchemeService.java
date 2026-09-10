package com.example.bisassistant.service;

import com.example.bisassistant.model.GovernmentScheme;
import com.example.bisassistant.model.SchemeEligibilityRequest;
import com.example.bisassistant.model.SchemeMatchResult;
import com.example.bisassistant.repository.MockSchemeRepository;
import com.example.bisassistant.repository.MockSchemeRepository.Criteria;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * PROTOTYPE rule-based eligibility engine - NOT an official government
 * eligibility determination. Compares a few basic profile fields (user
 * type, sector, state, business size) against each scheme's mock criteria
 * and produces a simple match score. Always returns a clearly-labelled
 * preliminary result; final eligibility is decided by the concerned
 * government authority.
 */
@Service
public class SchemeService {

    private final MockSchemeRepository repository;

    public SchemeService(MockSchemeRepository repository) {
        this.repository = repository;
    }

    public List<GovernmentScheme> findAll() {
        return repository.findAll();
    }

    public GovernmentScheme findById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No scheme found for id: " + id));
    }

    public List<SchemeMatchResult> checkEligibility(SchemeEligibilityRequest req) {
        List<SchemeMatchResult> results = new ArrayList<>();

        for (GovernmentScheme scheme : repository.findAll()) {
            Criteria c = repository.criteriaFor(scheme.id()).orElse(
                    new Criteria(List.of("Any"), List.of("All Sectors"), List.of("All India"), List.of("Any")));

            List<String> matched = new ArrayList<>();
            List<String> unmatched = new ArrayList<>();

            checkDimension("User Type", req.userType(), c.userTypes(), matched, unmatched);
            checkDimension("Sector", req.sector(), c.sectors(), matched, unmatched);
            checkDimension("Location", req.state(), c.states(), matched, unmatched);
            checkDimension("Business Size", req.businessSize(), c.businessSizes(), matched, unmatched);

            int total = matched.size() + unmatched.size();
            int score = total == 0 ? 0 : Math.round((matched.size() * 100f) / total);

            String status;
            if (unmatched.isEmpty()) status = "Eligible";
            else if (matched.size() >= 2) status = "Partially Matched";
            else status = "Not Matched";

            String why = unmatched.isEmpty()
                    ? "Your profile matches all the basic criteria for this scheme."
                    : "Your profile matches " + matched.size() + " out of " + total + " basic criteria for this scheme.";

            results.add(new SchemeMatchResult(
                    scheme.id(), scheme.schemeName(), scheme.department(), why, status, score, matched, unmatched, scheme.benefits()
            ));
        }

        results.sort(Comparator.comparingInt(SchemeMatchResult::relevanceScore).reversed());
        return results;
    }

    private void checkDimension(String label, String userValue, List<String> allowedValues, List<String> matched, List<String> unmatched) {
        boolean isOpen = allowedValues.stream().anyMatch(v -> v.equalsIgnoreCase("Any") || v.equalsIgnoreCase("All Sectors") || v.equalsIgnoreCase("All India"));
        boolean matches = isOpen || (userValue != null && allowedValues.stream().anyMatch(v -> v.equalsIgnoreCase(userValue.trim())));
        if (matches) matched.add(label + " matched");
        else unmatched.add(label + " criteria not matched");
    }
}
