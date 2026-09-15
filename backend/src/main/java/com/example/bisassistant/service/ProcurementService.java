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

        if (file.getOriginalFilename() == null ||
                !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF files are supported.");
        }

        try {

            // Extract text using PDFBox.
            // If PDF has little/no text, PdfExtractionService
            // automatically uses Tesseract OCR.
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

            return extractRequirements(text);

        } catch (Exception e) {

            throw new IllegalArgumentException(
                    "Could not analyze the uploaded PDF: " + e.getMessage(),
                    e
            );
        }
    }

    private ProcurementRequirement extractRequirements(String text) {

        /*
         * Keep line breaks because the procurement PDF contains
         * fields such as:
         *
         * Product: Electric Kettle
         * Material: Stainless Steel
         * Capacity: 1.5 Litres
         * Application: Household and Office Use
         *
         * Removing line breaks was causing the complete remaining
         * PDF text to be assigned to one field.
         */
        String normalizedText = text
                .replace("\r", "")
                .replaceAll("[ \\t]+", " ")
                .trim();

        String product = findValue(
                normalizedText,
                "Product",
                "Product Name",
                "Item",
                "Item Name",
                "Equipment",
                "Material Name"
        );

        String material = findValue(
                normalizedText,
                "Material",
                "Material Type",
                "Construction Material"
        );

        String capacity = findValue(
                normalizedText,
                "Capacity",
                "Storage Capacity",
                "Volume"
        );

        String application = findValue(
                normalizedText,
                "Application",
                "Intended Use",
                "Usage",
                "Use"
        );

       List<String> technicalRequirements = new ArrayList<>();

// Electrical requirements
addIfFound(
        technicalRequirements,
        normalizedText,
        "Rated Voltage",
        "Rated Voltage 230 V AC"
);

addIfFound(
        technicalRequirements,
        normalizedText,
        "Rated Power",
        "Rated Power 1500 W"
);

// Safety requirements
addIfFound(
        technicalRequirements,
        normalizedText,
        "Safety",
        "Safety Automatic shut-off and boil-dry protection"
);

addIfFound(
        technicalRequirements,
        normalizedText,
        "Automatic shut-off",
        "Automatic shut-off"
);

addIfFound(
        technicalRequirements,
        normalizedText,
        "boil-dry",
        "Boil-dry protection"
);

// Construction
addIfFound(
        technicalRequirements,
        normalizedText,
        "Leak proof",
        "Leak proof construction"
);

// Material quality
addIfFound(
        technicalRequirements,
        normalizedText,
        "Food grade",
        "Food grade material"
);

addIfFound(
        technicalRequirements,
        normalizedText,
        "Industrial grade",
        "Industrial grade material"
);

// Surface / durability
addIfFound(
        technicalRequirements,
        normalizedText,
        "UV resistant",
        "UV resistant"
);

addIfFound(
        technicalRequirements,
        normalizedText,
        "Corrosion resistant",
        "Corrosion resistant"
);

        // Show some extracted text if no technical requirement
        // keywords were detected.
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

    /**
     * Finds a value written on its own labelled line.
     *
     * Example:
     * Material: Stainless Steel
     *
     * It returns only:
     * Stainless Steel
     */
    private String findValue(String text, String... labels) {

        for (String label : labels) {

            Pattern pattern = Pattern.compile(
                    "(?im)^\\s*"
                            + Pattern.quote(label)
                            + "\\s*[:\\-]\\s*(.+?)\\s*$"
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