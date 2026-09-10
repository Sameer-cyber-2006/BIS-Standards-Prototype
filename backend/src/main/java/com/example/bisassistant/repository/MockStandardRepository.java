package com.example.bisassistant.repository;

import com.example.bisassistant.model.Standard;
import org.springframework.stereotype.Repository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * In-memory mock BIS knowledge base for the prototype.
 * No real database and no verified BIS data - these are illustrative demo
 * entries loosely inspired by real IS standard numbers, clearly marked as
 * prototype/mock data everywhere they are surfaced to the frontend.
 */
@Repository
public class MockStandardRepository {

    private final Map<String, Standard> standards = new LinkedHashMap<>();

    public MockStandardRepository() {
        standards.put("1", new Standard(
                "1", "IS 12701 : 1996",
                "Polyethylene Water Storage Tanks - Specification",
                "Covers rotational / blow moulded polyethylene tanks used for storage of potable and industrial water.",
                "Applicable to industrial and domestic water storage tanks made of HDPE/LDPE.",
                List.of("UV-stabilised material", "Minimum wall thickness", "Leak-proof construction", "Food/industrial grade material"),
                "Verified"
        ));
        standards.put("2", new Standard(
                "2", "IS 10553 : 1983",
                "Rotationally Moulded Tanks for Water Storage - Guidelines",
                "Guidelines for design and moulding quality of rotationally moulded plastic water tanks.",
                "Applicable to rotationally moulded plastic storage containers.",
                List.of("Moulding quality", "Material grade", "Dimensional tolerance"),
                "Verified"
        ));
        standards.put("3", new Standard(
                "3", "IS 15410 : 2003",
                "Chemical Resistant Storage Tanks - General Requirements",
                "General requirements for tanks intended to store chemically active liquids.",
                "Applicable to industrial containers exposed to chemical contents.",
                List.of("Chemical resistance", "Structural integrity", "Application-specific lining"),
                "Verified"
        ));
        standards.put("4", new Standard(
                "4", "IS 17482 : 2021",
                "Stainless Steel Vacuum Insulated Water Bottles - Specification",
                "Covers stainless steel vacuum insulated bottles intended for storing potable liquids.",
                "Applicable to household and consumer drinkware made of food-grade stainless steel.",
                List.of("Food-grade base material", "Vacuum insulation performance", "Leak-proof cap design"),
                "Verified"
        ));
        standards.put("5", new Standard(
                "5", "IS 2925 : 1984",
                "Industrial Safety Helmets - Specification",
                "Covers protective helmets intended for use in industrial and construction environments.",
                "Applicable to head protection equipment used in industrial settings.",
                List.of("Shock absorption", "Penetration resistance", "Strap and retention system"),
                "Verified"
        ));
    }

    public List<Standard> findAll() {
        return List.copyOf(standards.values());
    }

    public Optional<Standard> findById(String id) {
        return Optional.ofNullable(standards.get(id));
    }

    public Optional<Standard> findByStandardNumber(String standardNumber) {
        return standards.values().stream()
                .filter(s -> s.standardNumber().equalsIgnoreCase(standardNumber))
                .findFirst();
    }
}
