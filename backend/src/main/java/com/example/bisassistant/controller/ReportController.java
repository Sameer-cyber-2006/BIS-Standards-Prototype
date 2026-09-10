package com.example.bisassistant.controller;

import com.example.bisassistant.model.ComplianceReport;
import com.example.bisassistant.model.ComplianceReportRequest;
import com.example.bisassistant.service.ReportService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    /** POST /api/reports/generate - builds the Compliance Report preview data. */
    @PostMapping("/generate")
    public ComplianceReport generate(@RequestBody ComplianceReportRequest request) {
        return reportService.generate(request);
    }
}
