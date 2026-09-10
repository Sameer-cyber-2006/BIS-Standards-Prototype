package com.example.bisassistant.repository;

import com.example.bisassistant.model.GovernmentScheme;
import org.springframework.stereotype.Repository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * In-memory mock Government Schemes knowledge base for the prototype.
 * No real government schemes API/database is connected. Each scheme also
 * carries a small structured "criteria" record (not shown to the frontend
 * directly) used by SchemeService's rule-based matching engine.
 */
@Repository
public class MockSchemeRepository {

    /** Internal structured criteria used only for matching - not returned as-is to the frontend. */
    public record Criteria(
            List<String> userTypes,      // e.g. ["MSME", "Startup"], or ["Any"]
            List<String> sectors,        // e.g. ["Manufacturing"], or ["All Sectors"]
            List<String> states,         // e.g. ["Maharashtra"], or ["All India"]
            List<String> businessSizes   // e.g. ["Small", "Medium"], or ["Any"]
    ) {}

    private final Map<String, GovernmentScheme> schemes = new LinkedHashMap<>();
    private final Map<String, Criteria> criteria = new LinkedHashMap<>();

    public MockSchemeRepository() {
        add("1",
                new GovernmentScheme("1", "Prime Minister's Employment Generation Programme (PMEGP)",
                        "Ministry of Micro, Small and Medium Enterprises",
                        "New micro-enterprises, first-generation entrepreneurs",
                        "Manufacturing, Services", "All India",
                        List.of("Age 18 years and above", "New unit (not an expansion of an existing one)", "Minimum educational qualification for higher project costs"),
                        "Capital subsidy of 15-35% on the project cost, helping reduce the initial financial burden of setting up a new unit.",
                        List.of("Aadhaar Card", "Project report", "Caste/category certificate (if applicable)", "Educational qualification proof"),
                        "Apply through the KVIC / District Industries Centre online portal."),
                new Criteria(List.of("MSME", "Startup", "Industry"), List.of("All Sectors"), List.of("All India"), List.of("Micro", "Small")));

        add("2",
                new GovernmentScheme("2", "Credit Guarantee Fund Scheme for Micro and Small Enterprises (CGTMSE)",
                        "Ministry of Micro, Small and Medium Enterprises",
                        "Micro and small enterprises",
                        "Manufacturing, Services, Trading", "All India",
                        List.of("Registered micro or small enterprise", "No collateral-based credit history required", "Business must be a new or existing MSME"),
                        "Collateral-free credit facility up to a specified limit, backed by a government credit guarantee.",
                        List.of("Udyam Registration Certificate", "Business plan", "KYC documents"),
                        "Apply through any scheduled bank or eligible financial institution empanelled with CGTMSE."),
                new Criteria(List.of("MSME"), List.of("All Sectors"), List.of("All India"), List.of("Micro", "Small")));

        add("3",
                new GovernmentScheme("3", "Startup India Seed Fund Scheme",
                        "Department for Promotion of Industry and Internal Trade (DPIIT)",
                        "Early-stage startups",
                        "Technology, Manufacturing, Services", "All India",
                        List.of("DPIIT-recognised startup", "Incorporated not more than 2 years ago", "Innovative product/service with scalability potential"),
                        "Financial assistance for proof of concept, prototype development, product trials, and market entry.",
                        List.of("DPIIT recognition certificate", "Pitch deck", "Certificate of incorporation"),
                        "Apply through the Startup India portal to an eligible incubator."),
                new Criteria(List.of("Startup"), List.of("All Sectors"), List.of("All India"), List.of("Micro", "Small", "Not Applicable")));

        add("4",
                new GovernmentScheme("4", "Maharashtra State Industrial Promotion Scheme",
                        "Directorate of Industries, Government of Maharashtra",
                        "Manufacturing units located in Maharashtra",
                        "Manufacturing", "Maharashtra",
                        List.of("Unit located within Maharashtra", "Registered manufacturing enterprise", "Falls within Micro, Small or Medium category"),
                        "Industrial promotion subsidy, electricity duty exemption, and stamp duty concessions for eligible manufacturing units.",
                        List.of("Udyam Registration Certificate", "Factory/unit location proof", "Project investment details"),
                        "Apply through the Maharashtra Industry, Trade and Investment Facilitation Cell (MAITRI) portal."),
                new Criteria(List.of("MSME", "Industry"), List.of("Manufacturing"), List.of("Maharashtra"), List.of("Micro", "Small", "Medium")));

        add("5",
                new GovernmentScheme("5", "Udyam Sakhi - Women Entrepreneurship Support Scheme",
                        "Ministry of Micro, Small and Medium Enterprises",
                        "Women-led MSMEs and startups",
                        "All Sectors", "All India",
                        List.of("Woman entrepreneur / majority woman ownership", "Registered or registering MSME/startup", "Any business size"),
                        "Handholding support, mentorship, and priority access to government scheme information for women-led enterprises.",
                        List.of("Aadhaar Card", "Udyam Registration Certificate (if available)", "Business ownership proof"),
                        "Apply through the Udyam Sakhi portal or nearest MSME facilitation centre."),
                new Criteria(List.of("MSME", "Startup", "Consumer"), List.of("All Sectors"), List.of("All India"), List.of("Any")));

        add("6",
                new GovernmentScheme("6", "Consumer Product Quality Awareness & Grievance Support",
                        "Department of Consumer Affairs",
                        "Individual consumers",
                        "All Sectors", "All India",
                        List.of("Individual consumer", "No business registration required"),
                        "Guidance on product quality standards, BIS Hallmark/ISI verification, and consumer grievance redressal.",
                        List.of("None - informational scheme"),
                        "Access through the National Consumer Helpline or UMANG app."),
                new Criteria(List.of("Consumer"), List.of("All Sectors"), List.of("All India"), List.of("Any")));
    }

    private void add(String id, GovernmentScheme scheme, Criteria c) {
        schemes.put(id, scheme);
        criteria.put(id, c);
    }

    public List<GovernmentScheme> findAll() {
        return List.copyOf(schemes.values());
    }

    public Optional<GovernmentScheme> findById(String id) {
        return Optional.ofNullable(schemes.get(id));
    }

    public Optional<Criteria> criteriaFor(String id) {
        return Optional.ofNullable(criteria.get(id));
    }
}
