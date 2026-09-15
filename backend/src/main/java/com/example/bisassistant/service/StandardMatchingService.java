package com.example.bisassistant.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.bisassistant.model.MatchingResult;
import com.example.bisassistant.model.ProcurementRequirement;

/**
 * PROTOTYPE MATCHING ENGINE.
 * Matches extracted procurement requirements with demo standard data.
 */
@Service
public class StandardMatchingService {

    public List<MatchingResult> match(ProcurementRequirement req) {

        String product = req.product() == null
                ? ""
                : req.product().toLowerCase();

        String material = req.material() == null
                ? ""
                : req.material().toLowerCase();

        // ---------------------------------------------------------
        // ELECTRIC KETTLE
        // ---------------------------------------------------------
        if (product.contains("kettle")) {

            return List.of(
                    new MatchingResult(
                            1,
                            "1",
                            "Electric Kettle Standard",
                            "Electric Kettles - Specification",
                            92,
                            List.of(
                                    "Product Category",
                                    "Material",
                                    "Application"
                            ),
                            "Electrical safety and performance requirements need verification"
                    )
            );
        }

        // ---------------------------------------------------------
        // WATER BOTTLE
        // ---------------------------------------------------------
        if (product.contains("bottle")) {

            return List.of(
                    new MatchingResult(
                            1,
                            "4",
                            "IS 17482 : 2021",
                            "Stainless Steel Vacuum Insulated Water Bottles - Specification",
                            92,
                            List.of(
                                    "Product Category",
                                    "Material",
                                    "Application"
                            ),
                            "Wall-thickness tolerance needs verification"
                    ),
                    new MatchingResult(
                            2,
                            "1",
                            "IS 12701 : 1996",
                            "Plastic Water Storage Containers - Standard Specification",
                            60,
                            List.of("Application"),
                            "Product category and material need review"
                    )
            );
        }

        // ---------------------------------------------------------
        // HELMET
        // ---------------------------------------------------------
        if (product.contains("helmet")) {

            return List.of(
                    new MatchingResult(
                            1,
                            "5",
                            "IS 2925 : 1984",
                            "Industrial Safety Helmets - Specification",
                            88,
                            List.of(
                                    "Product Category",
                                    "Application"
                            ),
                            "Shock-absorption test data not supplied"
                    )
            );
        }

        // ---------------------------------------------------------
        // UNKNOWN PRODUCT
        // ---------------------------------------------------------
        // Do NOT automatically return Water Tank.
        // If the product is not confidently identified,
        // return an empty result instead of showing an unrelated standard.

        return List.of();
    }
}