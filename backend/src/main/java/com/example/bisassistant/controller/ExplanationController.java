package com.example.bisassistant.controller;

import com.example.bisassistant.model.*;
import com.example.bisassistant.service.ExplanationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/explanation")
public class ExplanationController {

    private final ExplanationService explanationService;

    public ExplanationController(ExplanationService explanationService) {
        this.explanationService = explanationService;
    }

    /** POST /api/explanation - simulated AI explanation for a matched standard. */
    @PostMapping
    public ExplanationResponse explain(@RequestBody ExplanationRequest request) {
        return explanationService.explain(request);
    }

    /** POST /api/explanation/followup - simulated answer to a follow-up chat question. */
    @PostMapping("/followup")
    public FollowUpResponse followUp(@RequestBody FollowUpRequest request) {
        String answer = explanationService.followUp(request.question(), request.standardNumber());
        return new FollowUpResponse(answer);
    }
}
