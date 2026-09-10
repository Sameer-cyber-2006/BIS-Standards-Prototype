package com.example.bisassistant.service;

import com.example.bisassistant.model.ComplianceReport;
import com.example.bisassistant.model.ComplianceReportRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

/**
 * PROTOTYPE - builds a structured report object from whatever the frontend
 * already knows (no real PDF generation, no legal certification). The
 * report explicitly uses "Potential Compliance Gaps" / "Preliminary
 * Analysis" language rather than any certification claim.
 */
@Service
public class ReportService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy");

    public ComplianceReport generate(ComplianceReportRequest req) {
        String reportId = "BIS-CMP-2026-" + ThreadLocalRandom.current().nextInt(10000, 99999);
        List<String> gaps = req.potentialGaps() == null || req.potentialGaps().isEmpty()
                ? List.of("One requirement needs manual verification")
                : req.potentialGaps();

        return new ComplianceReport(
                reportId,
                LocalDate.now().format(DATE_FMT),
                req.product(),
                req.material(),
                req.capacity(),
                req.application(),
                req.recommendedStandard(),
                req.standardTitle(),
                req.relevanceScore(),
                req.matchedRequirements(),
                gaps,
                req.explanation(),
                "Bureau of Indian Standards (BIS) - Verified Standards Knowledge Base",
                "This report reflects a preliminary, AI-assisted analysis and does not constitute a legal "
                        + "or certified compliance determination.",
                "Preliminary Analysis"
        );
    }
}
