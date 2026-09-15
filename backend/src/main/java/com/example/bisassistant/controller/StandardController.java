package com.example.bisassistant.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bisassistant.entity.StandardRequirement;
import com.example.bisassistant.model.MatchingResult;
import com.example.bisassistant.model.ProcurementRequirement;
import com.example.bisassistant.model.Standard;
import com.example.bisassistant.repository.MockStandardRepository;
import com.example.bisassistant.repository.StandardRepository;
import com.example.bisassistant.repository.StandardRequirementRepository;
import com.example.bisassistant.service.StandardMatchingService;

@RestController
@RequestMapping("/api/standards")
public class StandardController {

    private final StandardMatchingService matchingService;
    private final MockStandardRepository standardRepository;
    private final StandardRepository dbStandardRepository;
    private final StandardRequirementRepository requirementRepository;

    public StandardController(
            StandardMatchingService matchingService,
            MockStandardRepository standardRepository,
            StandardRepository dbStandardRepository,
            StandardRequirementRepository requirementRepository) {

        this.matchingService = matchingService;
        this.standardRepository = standardRepository;
        this.dbStandardRepository = dbStandardRepository;
        this.requirementRepository = requirementRepository;
    }

    /**
     * POST /api/standards/match
     * Ranked standard matches for extracted procurement requirements.
     */
    @PostMapping("/match")
    public List<MatchingResult> match(
            @RequestBody ProcurementRequirement requirement) {

        return matchingService.match(requirement);
    }

    /**
     * GET /api/standards/{id}
     * Existing mock standard detail lookup.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Standard> getById(
            @PathVariable String id) {

        return standardRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * GET /api/standards/test-db
     * Test MySQL database standard lookup.
     */
    @GetMapping("/test-db")
    public ResponseEntity<com.example.bisassistant.entity.Standard> testDatabase() {

        com.example.bisassistant.entity.Standard standard =
                dbStandardRepository.findByIsNumber("IS 367:1993");

        if (standard == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(standard);
    }

    /**
     * GET /api/standards/test-requirements
     * Test MySQL standard requirements lookup.
     */
    @GetMapping("/test-requirements")
    public List<StandardRequirement> testRequirements() {

        return requirementRepository.findBySid(1);
    }
}