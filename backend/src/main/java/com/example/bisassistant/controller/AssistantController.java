package com.example.bisassistant.controller;

import com.example.bisassistant.model.AssistantRequest;
import com.example.bisassistant.model.AssistantResponse;
import com.example.bisassistant.service.AssistantService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant")
public class AssistantController {

    private final AssistantService assistantService;

    public AssistantController(AssistantService assistantService) {
        this.assistantService = assistantService;
    }

    /** POST /api/assistant/query - main BIS Standard Assistant chat endpoint. */
    @PostMapping("/query")
    public AssistantResponse query(@RequestBody AssistantRequest request) {
        return assistantService.answerQuery(request.query());
    }
}
