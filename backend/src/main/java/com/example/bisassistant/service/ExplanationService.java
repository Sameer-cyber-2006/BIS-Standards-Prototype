package com.example.bisassistant.service;

import com.example.bisassistant.model.ExplanationRequest;
import com.example.bisassistant.model.ExplanationResponse;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * PROTOTYPE - "AI Explanation" is simulated by formatting the fields the
 * frontend already has (product, standard, matched requirements, gap) into
 * readable sentences. No Gemini call is made here.
 */
@Service
public class ExplanationService {

    public ExplanationResponse explain(ExplanationRequest req) {
        String matchedList = String.join(", ", req.matchedRequirements());
        String summary = "This standard appears relevant because the product category, material and "
                + "intended application match the identified requirements.";
        String simple = "In simple terms, " + req.standardNumber() + " appears suitable for the identified "
                + "product characteristics (matched on: " + matchedList + "), but the remaining "
                + "technical requirement should be verified before making compliance decisions.";

        return new ExplanationResponse(
                summary,
                req.matchedRequirements(),
                List.of(req.potentialGap() == null ? "One technical requirement needs verification" : req.potentialGap()),
                simple,
                "AI-Generated Explanation"
        );
    }

    public String followUp(String question, String standardNumber) {
        String q = question == null ? "" : question.toLowerCase();
        if (q.contains("simple")) {
            return "In plain terms, " + standardNumber + " sets out how this type of product should be made "
                    + "and tested, so buyers and regulators can trust its quality and safety.";
        }
        if (q.contains("relevant")) {
            return "It is relevant because the product's category, material and intended use fall within "
                    + "what " + standardNumber + " was written to cover.";
        }
        if (q.contains("matched")) {
            return "The product category, material and application were matched against this standard's scope.";
        }
        if (q.contains("verif")) {
            return "One technical requirement could not be confirmed automatically and should be checked "
                    + "against the supplier's datasheet before finalising.";
        }
        return "This standard's scope, applicability and key requirements are the basis for the match - "
                + "ask about matched requirements or verification gaps for more detail.";
    }
}
