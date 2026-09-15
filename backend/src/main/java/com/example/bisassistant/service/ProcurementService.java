package com.example.bisassistant.service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.bisassistant.model.ProcurementRequirement;

@Service
public class ProcurementService {

    private final PdfExtractionService pdfExtractionService;

    public ProcurementService(PdfExtractionService pdfExtractionService) {
        this.pdfExtractionService = pdfExtractionService;
    }

    public ProcurementRequirement analyze(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please upload a PDF file.");
        }

        if (!file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF files are supported.");
        }

        try {
            // 1. Extract text from PDF using PDFBox
            // 2. If PDF has little/no text, PdfExtractionService automatically
            //    tries Tesseract OCR.
            PdfExtractionService.ExtractionResult result =
                    pdfExtractionService.extract(file.getBytes());

            String text = result.text;

            if (text == null || text.isBlank()) {
                throw new IllegalArgumentException(
                        "No text could be extracted from the uploaded PDF."
                );
            }

            System.out.println("===== EXTRACTED PDF TEXT =====");
            System.out.println(text);
            System.out.println("===== OCR USED: " + result.usedOcr + " =====");
            System.out.println("===== PAGE COUNT: " + result.pageCount + " =====");

            // Extract basic procurement details from the extracted text
            return extractRequirements(text);

        } catch (Exception e) {
            throw new IllegalArgumentException(
                    "Could not analyze the uploaded PDF: " + e.getMessage(), e
            );
        }
    }

    private ProcurementRequirement extractRequirements(String text) {

        String normalizedText = text.replace("\r", " ")
                .replace("\n", " ")
                .replaceAll("\\s+", " ")
                .trim();

        String product = findValue(normalizedText,
                "Product",
                "Product Name",
                "Item",
                "Item Name",
                "Equipment",
                "Material Name"
        );

        String material = findValue(normalizedText,
                "Material",
                "Material Type",
                "Construction Material"
        );

        String capacity = findValue(normalizedText,
                "Capacity",
                "Storage Capacity",
                "Volume"
        );

        String application = findValue(normalizedText,
                "Application",
                "Intended Use",
                "Usage",
                "Use"
        );

        List<String> technicalRequirements = new ArrayList<>();

        addIfFound(technicalRequirements, normalizedText,
                "UV resistant",
                "UV resistant"
        );

        addIfFound(technicalRequirements, normalizedText,
                "Leak proof",
                "Leak proof construction"
        );

        addIfFound(technicalRequirements, normalizedText,
                "Food grade",
                "Food grade material"
        );

        addIfFound(technicalRequirements, normalizedText,
                "Industrial grade",
                "Industrial grade material"
        );

        addIfFound(technicalRequirements, normalizedText,
                "Corrosion resistant",
                "Corrosion resistant"
        );

        // If no specific fields were detected, keep extracted text
        // as a technical requirement so the user can see that
        // PDF extraction actually worked.
        if (technicalRequirements.isEmpty()) {
            technicalRequirements.add(
                    getShortExtractedText(normalizedText)
            );
        }

        return new ProcurementRequirement(
                emptyToNotSpecified(product),
                emptyToNotSpecified(material),
                emptyToNotSpecified(capacity),
                emptyToNotSpecified(application),
                technicalRequirements
        );
    }

    private String findValue(String text, String... labels) {

        for (String label : labels) {

            Pattern pattern = Pattern.compile(
                    "(?i)" + Pattern.quote(label)
                            + "\\s*[:\\-]\\s*([^,;|]+)"
            );

            Matcher matcher = pattern.matcher(text);

            if (matcher.find()) {
                return matcher.group(1).trim();
            }
        }

        return "";
    }

    private void addIfFound(
            List<String> requirements,
            String text,
            String searchText,
            String displayText
    ) {

        if (text.toLowerCase().contains(searchText.toLowerCase())) {
            requirements.add(displayText);
        }
    }

    private String emptyToNotSpecified(String value) {

        if (value == null || value.isBlank()) {
            return "Not specified";
        }

        return value;
    }

    private String getShortExtractedText(String text) {

        if (text.length() <= 300) {
            return text;
        }

        return text.substring(0, 300) + "...";
    }
}