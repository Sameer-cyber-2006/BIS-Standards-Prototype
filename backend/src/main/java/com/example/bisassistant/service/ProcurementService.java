package com.example.bisassistant.service;

import com.example.bisassistant.model.ProcurementRequirement;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * PROTOTYPE ONLY - accepts an uploaded procurement PDF but does NOT parse it.
 * No PDFBox, no OCR/Tesseract. The uploaded file is only used to confirm
 * that a file was received; the "extracted" requirements are fixed demo data
 * representing what a real extraction pipeline would eventually return.
 */
@Service
public class ProcurementService {

    public ProcurementRequirement analyze(MultipartFile file) {
        // In production: PDF text extraction -> OCR fallback -> AI requirement
        // understanding (Gemini) would populate this object dynamically.
        return new ProcurementRequirement(
                "Industrial Water Tank",
                "HDPE",
                "5000 Litres",
                "Industrial",
                List.of("UV resistant", "Leak proof construction", "Food/industrial grade material")
        );
    }
}
