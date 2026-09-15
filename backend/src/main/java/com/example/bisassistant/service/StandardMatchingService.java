package com.example.bisassistant.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.example.bisassistant.entity.Standard;
import com.example.bisassistant.entity.StandardRequirement;
import com.example.bisassistant.model.MatchingResult;
import com.example.bisassistant.model.ProcurementRequirement;
import com.example.bisassistant.repository.StandardRepository;
import com.example.bisassistant.repository.StandardRequirementRepository;

@Service
public class StandardMatchingService {

    private final StandardRepository standardRepository;
    private final StandardRequirementRepository requirementRepository;

    public StandardMatchingService(
            StandardRepository standardRepository,
            StandardRequirementRepository requirementRepository) {

        this.standardRepository = standardRepository;
        this.requirementRepository = requirementRepository;
    }

    public List<MatchingResult> match(ProcurementRequirement req) {

        if (req == null) {
            return List.of();
        }

        List<Standard> standards = standardRepository.findAll();
        List<MatchingResult> results = new ArrayList<>();

        for (Standard standard : standards) {

            if (standard.getStatus() != null
                    && !standard.getStatus().equalsIgnoreCase("ACTIVE")) {
                continue;
            }

            List<StandardRequirement> requirements =
                    requirementRepository.findBySid(standard.getId());

            int score = calculateScore(req, standard, requirements);

            if (score <= 0) {
                continue;
            }

            List<String> matched =
                    findMatchedRequirements(req, standard, requirements);

            String gap =
                    findPotentialGap(req, standard, requirements);

            results.add(
                    new MatchingResult(
                            0,
                            String.valueOf(standard.getId()),
                            standard.getIsNumber(),
                            standard.getTitle(),
                            score,
                            matched,
                            gap
                    )
            );
        }

        results.sort(
                Comparator.comparingInt(MatchingResult::relevanceScore)
                        .reversed()
        );

        List<MatchingResult> ranked = new ArrayList<>();

        for (int i = 0; i < results.size(); i++) {

            MatchingResult r = results.get(i);

            ranked.add(
                    new MatchingResult(
                            i + 1,
                            r.standardId(),
                            r.standardNumber(),
                            r.title(),
                            r.relevanceScore(),
                            r.matchedRequirements(),
                            r.potentialGap()
                    )
            );
        }

        return ranked;
    }

    /*
     * ------------------------------------------------------------
     * DYNAMIC RELEVANCE SCORE
     * ------------------------------------------------------------
     *
     * Product       = 25
     * Material      = 15
     * Application   = 15
     * Capacity      = 10
     * Voltage       = 10
     * Safety        = 10
     * Performance   = 15
     *
     * Total         = 100
     */
    private int calculateScore(
            ProcurementRequirement req,
            Standard standard,
            List<StandardRequirement> requirements) {

        int score = 0;

        // ---------------------------------------------------------
        // 1. PRODUCT - 25
        // ---------------------------------------------------------

        String product = safe(req.product());

        if (!product.isBlank()) {

            if (containsAny(
                    standard.getCategory(),
                    product)
                    || containsAny(
                    standard.getTitle(),
                    product)
                    || containsAny(
                    standard.getScope(),
                    product)) {

                score += 25;
            }
        }

        // ---------------------------------------------------------
        // 2. MATERIAL - 15
        // ---------------------------------------------------------

        String material = safe(req.material());

        if (!material.isBlank()) {

            if (materialMatches(
                    material,
                    standard,
                    requirements)) {

                score += 15;
            }
        }

        // ---------------------------------------------------------
        // 3. APPLICATION - 15
        // ---------------------------------------------------------

        String application = safe(req.application());

        if (!application.isBlank()) {

            if (applicationMatches(
                    application,
                    standard)) {

                score += 15;
            }
        }

        // ---------------------------------------------------------
        // 4. CAPACITY - 10
        // ---------------------------------------------------------

        if (capacityMatches(req, requirements)) {
            score += 10;
        }

        // ---------------------------------------------------------
        // 5. VOLTAGE - 10
        // ---------------------------------------------------------

        if (voltageMatches(req, requirements)) {
            score += 10;
        }

        // ---------------------------------------------------------
        // 6. SAFETY - 10
        // ---------------------------------------------------------

        if (safetyMatches(
                req,
                requirements)) {

            score += 10;
        }

        // ---------------------------------------------------------
        // 7. PERFORMANCE - 15
        // ---------------------------------------------------------

        if (performanceMatches(
                req,
                requirements)) {

            score += 15;
        }

        return Math.min(score, 100);
    }

    // =============================================================
    // MATERIAL MATCHING
    // =============================================================

    private boolean materialMatches(
            String material,
            Standard standard,
            List<StandardRequirement> requirements) {

        String normalizedMaterial =
                normalize(material);

        if (containsAny(
                standard.getScope(),
                normalizedMaterial)) {
            return true;
        }

        if (containsAny(
                standard.getTitle(),
                normalizedMaterial)) {
            return true;
        }

        for (StandardRequirement r : requirements) {

            String name = normalize(
                    r.getRequirementName());

            String value = normalize(
                    r.getRequirementValue());

            if (name.contains("material")
                    && (value.contains(normalizedMaterial)
                    || normalizedMaterial.contains(value))) {

                return true;
            }
        }

        /*
         * If the BIS standard does not specify the procurement
         * material, we do not treat it as a mismatch.
         *
         * Product-specific standard can still be highly relevant.
         */

        boolean hasMaterialRequirement = requirements.stream()
                .anyMatch(r ->
                        normalize(r.getRequirementName())
                                .contains("material"));

        return !hasMaterialRequirement;
    }

    // =============================================================
    // APPLICATION MATCHING
    // =============================================================

    private boolean applicationMatches(
            String application,
            Standard standard) {

        String app = normalize(application);

        String scope = normalize(
                standard.getScope());

        String title = normalize(
                standard.getTitle());

        if (scope.contains(app)
                || app.contains(scope)) {
            return true;
        }

        if (title.contains(app)
                || app.contains(title)) {
            return true;
        }

        /*
         * Handle common procurement wording.
         *
         * Example:
         * "Household and Office Use"
         *
         * BIS scope:
         * "Household and Similar Use"
         */

        if (app.contains("household")
                && (scope.contains("household")
                || title.contains("household"))) {

            return true;
        }

        if (app.contains("office")
                && scope.contains("household")) {

            return true;
        }

        return false;
    }

    // =============================================================
    // CAPACITY MATCHING
    // =============================================================

    private boolean capacityMatches(
            ProcurementRequirement req,
            List<StandardRequirement> requirements) {

        Double procurementCapacity =
                extractNumber(req.capacity());

        if (procurementCapacity == null) {
            return false;
        }

        for (StandardRequirement r : requirements) {

            String name =
                    normalize(r.getRequirementName());

            if (!name.contains("capacity")) {
                continue;
            }

            Double standardCapacity =
                    extractNumber(
                            r.getRequirementValue());

            if (standardCapacity == null) {
                continue;
            }

            /*
             * BIS requirement:
             * rated capacity not exceeding 5 litres
             */

            if (procurementCapacity <= standardCapacity) {
                return true;
            }
        }

        return false;
    }

    // =============================================================
    // VOLTAGE MATCHING
    // =============================================================

    private boolean voltageMatches(
            ProcurementRequirement req,
            List<StandardRequirement> requirements) {

        Double procurementVoltage =
                extractNumberFromTechnicalRequirements(
                        req.technicalRequirements(),
                        "voltage");

        if (procurementVoltage == null) {
            return false;
        }

        for (StandardRequirement r : requirements) {

            String name =
                    normalize(r.getRequirementName());

            if (!name.contains("voltage")) {
                continue;
            }

            Double standardVoltage =
                    extractNumber(
                            r.getRequirementValue());

            if (standardVoltage == null) {
                continue;
            }

            /*
             * Maximum permitted voltage.
             */

            if (procurementVoltage <= standardVoltage) {
                return true;
            }
        }

        return false;
    }

    // =============================================================
    // SAFETY MATCHING
    // =============================================================

    private boolean safetyMatches(
            ProcurementRequirement req,
            List<StandardRequirement> requirements) {

        boolean standardHasSafety = requirements.stream()
                .anyMatch(r ->
                        "SAFETY".equalsIgnoreCase(
                                r.getRequirementType()));

        if (!standardHasSafety) {
            return false;
        }

        List<String> technical =
                req.technicalRequirements();

        if (technical == null) {
            return true;
        }

        for (String t : technical) {

            String text = normalize(t);

            if (text.contains("safety")
                    || text.contains("shut-off")
                    || text.contains("boil-dry")
                    || text.contains("protection")) {

                return true;
            }
        }

        return true;
    }

    // =============================================================
    // PERFORMANCE MATCHING
    // =============================================================

    private boolean performanceMatches(
            ProcurementRequirement req,
            List<StandardRequirement> requirements) {

        long performanceRequirements =
                requirements.stream()
                        .filter(r ->
                                "PERFORMANCE".equalsIgnoreCase(
                                        r.getRequirementType()))
                        .count();

        if (performanceRequirements == 0) {
            return false;
        }

        /*
         * Current procurement document represents a product
         * specification, so performance-related BIS tests are
         * treated as verification requirements.
         */

        return true;
    }

    // =============================================================
    // MATCHED REQUIREMENT DISPLAY
    // =============================================================

    private List<String> findMatchedRequirements(
            ProcurementRequirement req,
            Standard standard,
            List<StandardRequirement> requirements) {

        List<String> matched = new ArrayList<>();

        String product = safe(req.product());

        if (!product.isBlank()
                && (containsAny(
                standard.getCategory(),
                product)
                || containsAny(
                standard.getTitle(),
                product)
                || containsAny(
                standard.getScope(),
                product))) {

            matched.add("Product Category");
        }

        if (materialMatches(
                safe(req.material()),
                standard,
                requirements)) {

            matched.add("Material");
        }

        if (applicationMatches(
                safe(req.application()),
                standard)) {

            matched.add("Application");
        }

        if (capacityMatches(
                req,
                requirements)) {

            matched.add("Capacity");
        }

        if (voltageMatches(
                req,
                requirements)) {

            matched.add("Voltage");
        }

        if (safetyMatches(
                req,
                requirements)) {

            matched.add("Safety");
        }

        if (performanceMatches(
                req,
                requirements)) {

            matched.add("Performance");
        }

        if (matched.isEmpty()) {
            matched.add("Standard Category");
        }

        return matched;
    }

    // =============================================================
    // POTENTIAL GAP
    // =============================================================

    private String findPotentialGap(
            ProcurementRequirement req,
            Standard standard,
            List<StandardRequirement> requirements) {

        List<String> gaps = new ArrayList<>();

        if (!capacityMatches(req, requirements)) {
            gaps.add("Capacity verification");
        }

        if (!voltageMatches(req, requirements)) {
            gaps.add("Voltage verification");
        }

        if (!performanceMatches(req, requirements)) {
            gaps.add("Performance test verification");
        }

        if (gaps.isEmpty()) {
            return "No major specification gap identified. Final compliance requires verification against the applicable BIS standard.";
        }

        return String.join(", ", gaps)
                + " required.";
    }

    // =============================================================
    // HELPERS
    // =============================================================

    private String safe(String value) {

        return value == null
                ? ""
                : value.trim();
    }

    private String normalize(String value) {

        if (value == null) {
            return "";
        }

        return value
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", " ")
                .trim();
    }

    private boolean containsAny(
            String source,
            String search) {

        if (source == null
                || search == null
                || search.isBlank()) {

            return false;
        }

        String sourceNormalized =
                normalize(source);

        String searchNormalized =
                normalize(search);

        if (sourceNormalized.contains(
                searchNormalized)) {

            return true;
        }

        /*
         * Word-level matching.
         *
         * "electric kettle" should match
         * "electric kettles".
         */

        String[] words =
                searchNormalized.split("\\s+");

        int matchedWords = 0;

        for (String word : words) {

            if (word.length() >= 4
                    && sourceNormalized.contains(word)) {

                matchedWords++;
            }
        }

        return words.length > 0
                && matchedWords >= Math.max(
                        1,
                        words.length / 2);
    }

    private Double extractNumber(
            String value) {

        if (value == null
                || value.isBlank()) {

            return null;
        }

        Matcher matcher =
                Pattern.compile(
                        "(\\d+(?:\\.\\d+)?)")
                        .matcher(value);

        if (matcher.find()) {

            try {
                return Double.parseDouble(
                        matcher.group(1));
            } catch (NumberFormatException ignored) {
                return null;
            }
        }

        return null;
    }

    private Double extractNumberFromTechnicalRequirements(
            List<String> technicalRequirements,
            String keyword) {

        if (technicalRequirements == null) {
            return null;
        }

        for (String technical :
                technicalRequirements) {

            if (technical == null) {
                continue;
            }

            if (normalize(technical)
                    .contains(
                            normalize(keyword))) {

                Double number =
                        extractNumber(technical);

                if (number != null) {
                    return number;
                }
            }
        }

        return null;
    }
}