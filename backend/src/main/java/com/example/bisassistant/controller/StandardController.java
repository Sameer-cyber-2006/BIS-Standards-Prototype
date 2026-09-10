package com.example.bisassistant.controller;

import com.example.bisassistant.model.MatchingResult;
import com.example.bisassistant.model.ProcurementRequirement;
import com.example.bisassistant.model.Standard;
import com.example.bisassistant.repository.MockStandardRepository;
import com.example.bisassistant.service.StandardMatchingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/standards")
public class StandardController {

    private final StandardMatchingService matchingService;
    private final MockStandardRepository standardRepository;

    public StandardController(StandardMatchingService matchingService, MockStandardRepository standardRepository) {
        this.matchingService = matchingService;
        this.standardRepository = standardRepository;
    }

    /** POST /api/standards/match - ranked mock standard matches for extracted requirements. */
    @PostMapping("/match")
    public List<MatchingResult> match(@RequestBody ProcurementRequirement requirement) {
        return matchingService.match(requirement);
    }

    /** GET /api/standards/{id} - mock standard detail lookup. */
    @GetMapping("/{id}")
    public ResponseEntity<Standard> getById(@PathVariable String id) {
        return standardRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
