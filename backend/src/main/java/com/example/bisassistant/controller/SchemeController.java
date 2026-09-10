package com.example.bisassistant.controller;

import com.example.bisassistant.model.GovernmentScheme;
import com.example.bisassistant.model.SchemeEligibilityRequest;
import com.example.bisassistant.model.SchemeMatchResult;
import com.example.bisassistant.service.SchemeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schemes")
public class SchemeController {

    private final SchemeService schemeService;

    public SchemeController(SchemeService schemeService) {
        this.schemeService = schemeService;
    }

    /** GET /api/schemes - full mock government schemes catalogue. */
    @GetMapping
    public List<GovernmentScheme> getAll() {
        return schemeService.findAll();
    }

    /** GET /api/schemes/{id} - a single scheme's full details. */
    @GetMapping("/{id}")
    public GovernmentScheme getById(@PathVariable String id) {
        return schemeService.findById(id);
    }

    /** POST /api/schemes/eligibility - ranked schemes with basic eligibility results for a profile. */
    @PostMapping("/eligibility")
    public List<SchemeMatchResult> checkEligibility(@RequestBody SchemeEligibilityRequest request) {
        return schemeService.checkEligibility(request);
    }
}
