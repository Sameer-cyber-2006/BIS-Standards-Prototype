package com.example.bisassistant.controller;

import com.example.bisassistant.model.PatentGuidance;
import com.example.bisassistant.model.PatentRequest;
import com.example.bisassistant.service.PatentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patent")
public class PatentController {

    private final PatentService patentService;

    public PatentController(PatentService patentService) {
        this.patentService = patentService;
    }

    /** POST /api/patent/guidance - simulated preliminary patent guidance. */
    @PostMapping("/guidance")
    public PatentGuidance guidance(@RequestBody PatentRequest request) {
        return patentService.getGuidance(request.description());
    }
}
