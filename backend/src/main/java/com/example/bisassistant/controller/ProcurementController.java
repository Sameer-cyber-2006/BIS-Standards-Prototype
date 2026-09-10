package com.example.bisassistant.controller;

import com.example.bisassistant.model.ProcurementRequirement;
import com.example.bisassistant.service.ProcurementService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/procurement")
public class ProcurementController {

    private final ProcurementService procurementService;

    public ProcurementController(ProcurementService procurementService) {
        this.procurementService = procurementService;
    }

    /** POST /api/procurement/analyze - accepts a PDF upload (multipart/form-data, field "file"). */
    @PostMapping(value = "/analyze", consumes = "multipart/form-data")
    public ProcurementRequirement analyze(@RequestParam("file") MultipartFile file) {
        return procurementService.analyze(file);
    }
}
