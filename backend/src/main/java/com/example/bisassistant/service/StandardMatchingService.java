package com.example.bisassistant.service;

import com.example.bisassistant.model.MatchingResult;
import com.example.bisassistant.model.ProcurementRequirement;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * PROTOTYPE MATCHING ENGINE - NOT an official BIS matching result.
 * Uses simple keyword checks on the submitted requirement instead of a real
 * verified-BIS-knowledge-base + matching algorithm. Always returns a small,
 * clearly-labelled demo/mock ranked list.
 */
@Service
public class StandardMatchingService {

    public List<MatchingResult> match(ProcurementRequirement req) {
        String product = (req.product() == null ? "" : req.product()).toLowerCase();
        String material = (req.material() == null ? "" : req.material()).toLowerCase();

        if (product.contains("bottle")) {
            return List.of(
                    new MatchingResult(1, "4", "IS 17482 : 2021",
                            "Stainless Steel Vacuum Insulated Water Bottles - Specification",
                            92, List.of("Product Category", "Material", "Application"),
                            "Wall-thickness tolerance needs verification"),
                    new MatchingResult(2, "1", "IS 12701 : 1996",
                            "Plastic Water Storage Containers - Standard Specification",
                            60, List.of("Application"),
                            "Product category and material need review")
            );
        }
        if (product.contains("helmet")) {
            return List.of(
                    new MatchingResult(1, "5", "IS 2925 : 1984",
                            "Industrial Safety Helmets - Specification",
                            88, List.of("Product Category", "Application"),
                            "Shock-absorption test data not supplied")
            );
        }

        // Default demo case: industrial water tank / HDPE (matches the brief's worked example)
        return List.of(
                new MatchingResult(1, "1", "IS 12701 : 1996",
                        "Rotational Moulded Polyethylene Water Storage Tanks - Standard Specification",
                        92, List.of("Product Category", "Material", "Application"),
                        "Technical requirement needs verification"),
                new MatchingResult(2, "2", "IS 10553 : 1983",
                        "Plastic Water Storage Containers - Standard Specification",
                        78, List.of("Product Category", "Material"),
                        "Application scope requires verification"),
                new MatchingResult(3, "3", "IS 15410 : 2003",
                        "Industrial Plastic Containers - Standard Specification",
                        65, List.of("Material"),
                        "Product scope requires verification")
        );
    }
}
