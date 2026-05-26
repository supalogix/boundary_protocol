import { describe, expect, it } from "vitest";
import { FileDomainCatalogProvider } from "../providers/FileDomainCatalogProvider";
import { FileScenarioProvider } from "../providers/FileScenarioProvider";
import { validateScenarioFrame } from "../domain/validateScenarioFrame";
import type { DomainCatalog } from "../domain/types";
import type { ScenarioFrame } from "../domain/types";

async function loadCatalog(): Promise<DomainCatalog> {
  const catalogProvider = new FileDomainCatalogProvider(
    "data/catalogs/domainCatalog.json"
  );

  return catalogProvider.loadCatalog();
}

function makeValidCareGuiltScenario(): ScenarioFrame {
  return {
    id: "care_guilt_test",
    mode: "identify_pressure_pattern",
    context:
      "You told a friend you cannot help this weekend. They respond by questioning whether your refusal means you do not care.",
    scenarioCategories: ["friendships"],
    conceptualFrame: {
      value: "care",
      distinction: "care_not_compliance",
      condition: "voluntariness_remains_possible",
      pressure: "guilt",
      test: "can_say_no_and_still_care",
      corruptedForm: "compliance",
      boundary: "do_not_help_under_emotional_coercion",
      protocol: "pause_help_protocol",
    },
    prompt: "After everything I've done for you, you can't help me once?",
    choices: ["guilt", "urgency", "flattery", "minimization"],
    correctAnswer: "guilt",
    explanation:
      "This is guilt pressure because it frames refusal as moral failure or lack of care.",
    evidenceSpan: "After everything I've done for you",
    warrant: "The speaker frames refusal as moral failure or lack of care.",
  };
}

describe("ScenarioFrame semantic validation", () => {
  it("loads and accepts all scenarios from the editable scenario file", async () => {
    const catalog = await loadCatalog();

    const provider = new FileScenarioProvider({
      filePath: "data/scenarios.json",
      catalog,
    });

    const scenarios = await provider.loadScenarios();

    expect(scenarios.length).toBeGreaterThan(0);

    for (const scenario of scenarios) {
      expect(validateScenarioFrame(scenario, catalog)).toEqual([]);
    }
  });

  it("accepts a valid care/guilt scenario against the catalog", async () => {
    const catalog = await loadCatalog();
    const scenario = makeValidCareGuiltScenario();

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toEqual([]);
  });

  it("rejects missing context", async () => {
    const catalog = await loadCatalog();

    const scenario: ScenarioFrame = {
      ...makeValidCareGuiltScenario(),
      context: "",
    };

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toContain("Scenario must include context.");
  });

  it("rejects missing scenario categories", async () => {
    const catalog = await loadCatalog();

    const scenario: ScenarioFrame = {
      ...makeValidCareGuiltScenario(),
      scenarioCategories: [],
    };

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toContain(
      "Scenario must include at least one scenario category."
    );
  });

  it("rejects missing prompt", async () => {
    const catalog = await loadCatalog();

    const scenario: ScenarioFrame = {
      ...makeValidCareGuiltScenario(),
      prompt: "",
    };

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toContain("Scenario must include a prompt.");
  });

  it("rejects unknown values", async () => {
    const catalog = await loadCatalog();

    const scenario: ScenarioFrame = {
      ...makeValidCareGuiltScenario(),
      conceptualFrame: {
        ...makeValidCareGuiltScenario().conceptualFrame,
        value: "unknown_value",
      },
    };

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toContain("Unknown value: unknown_value");
  });

  it("rejects unknown distinctions", async () => {
    const catalog = await loadCatalog();

    const scenario: ScenarioFrame = {
      ...makeValidCareGuiltScenario(),
      conceptualFrame: {
        ...makeValidCareGuiltScenario().conceptualFrame,
        distinction: "unknown_distinction",
      },
    };

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toContain("Unknown distinction: unknown_distinction");
  });

  it("rejects unknown conditions", async () => {
    const catalog = await loadCatalog();

    const scenario: ScenarioFrame = {
      ...makeValidCareGuiltScenario(),
      conceptualFrame: {
        ...makeValidCareGuiltScenario().conceptualFrame,
        condition: "unknown_condition",
      },
    };

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toContain("Unknown condition: unknown_condition");
  });

  it("rejects unknown pressures", async () => {
    const catalog = await loadCatalog();

    const scenario: ScenarioFrame = {
      ...makeValidCareGuiltScenario(),
      conceptualFrame: {
        ...makeValidCareGuiltScenario().conceptualFrame,
        pressure: "unknown_pressure",
      },
      correctAnswer: "unknown_pressure",
      choices: [
        "guilt",
        "urgency",
        "flattery",
        "minimization",
        "unknown_pressure",
      ],
    };

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toContain("Unknown pressure: unknown_pressure");
  });

  it("rejects when a distinction does not belong to the selected value", async () => {
    const catalog = await loadCatalog();

    const scenario: ScenarioFrame = {
      ...makeValidCareGuiltScenario(),
      conceptualFrame: {
        ...makeValidCareGuiltScenario().conceptualFrame,
        distinction: "forgiveness_not_permission",
      },
    };

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toContain(
      'Distinction "forgiveness_not_permission" does not belong to value "care".'
    );
  });

  it("rejects when a corrupted form does not belong to the selected value", async () => {
    const catalog = await loadCatalog();

    const scenario: ScenarioFrame = {
      ...makeValidCareGuiltScenario(),
      conceptualFrame: {
        ...makeValidCareGuiltScenario().conceptualFrame,
        corruptedForm: "permission",
      },
    };

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toContain(
      'Corrupted form "permission" does not belong to value "care".'
    );
  });

  it("rejects when the condition does not preserve the distinction", async () => {
    const catalog = await loadCatalog();

    const scenario: ScenarioFrame = {
      ...makeValidCareGuiltScenario(),
      conceptualFrame: {
        ...makeValidCareGuiltScenario().conceptualFrame,
        condition: "accountability_remains_possible",
      },
    };

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toContain(
      'Condition "accountability_remains_possible" does not preserve distinction "care_not_compliance".'
    );
  });

  it("rejects when pressure does not threaten the selected condition", async () => {
    const catalog = await loadCatalog();

    const scenario: ScenarioFrame = {
      ...makeValidCareGuiltScenario(),
      conceptualFrame: {
        ...makeValidCareGuiltScenario().conceptualFrame,
        pressure: "minimization",
      },
      correctAnswer: "minimization",
      choices: ["guilt", "urgency", "flattery", "minimization"],
    };

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toContain(
      'Pressure "minimization" is not mapped as a threat to condition "voluntariness_remains_possible".'
    );
  });

  it("rejects when boundary does not protect the selected condition", async () => {
    const catalog = await loadCatalog();

    const scenario: ScenarioFrame = {
      ...makeValidCareGuiltScenario(),
      conceptualFrame: {
        ...makeValidCareGuiltScenario().conceptualFrame,
        boundary: "do_not_erase_the_pattern",
      },
    };

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toContain(
      'Boundary "do_not_erase_the_pattern" does not protect condition "voluntariness_remains_possible".'
    );
  });

  it("rejects when protocol does not protect the selected condition", async () => {
    const catalog = await loadCatalog();

    const scenario: ScenarioFrame = {
      ...makeValidCareGuiltScenario(),
      conceptualFrame: {
        ...makeValidCareGuiltScenario().conceptualFrame,
        protocol: "accountability_protocol",
      },
    };

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toContain(
      'Protocol "accountability_protocol" does not protect condition "voluntariness_remains_possible".'
    );
  });

  it("rejects when protocol does not handle the selected pressure", async () => {
    const catalog = await loadCatalog();

    const modifiedCatalog: DomainCatalog = {
      ...catalog,
      protocols: {
        ...catalog.protocols,
        pause_help_protocol: {
          ...catalog.protocols.pause_help_protocol,
          handlesPressures: ["urgency"],
        },
      },
    };

    const scenario = makeValidCareGuiltScenario();

    const errors = validateScenarioFrame(scenario, modifiedCatalog);

    expect(errors).toContain(
      'Protocol "pause_help_protocol" does not handle pressure "guilt".'
    );
  });

  it("rejects when the test does not reveal the selected condition", async () => {
    const catalog = await loadCatalog();

    const scenario: ScenarioFrame = {
      ...makeValidCareGuiltScenario(),
      conceptualFrame: {
        ...makeValidCareGuiltScenario().conceptualFrame,
        test: "can_forgive_and_still_require_change",
      },
    };

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toContain(
      'Test "can_forgive_and_still_require_change" does not reveal condition "voluntariness_remains_possible".'
    );
  });

  it("rejects when correctAnswer does not match conceptual pressure", async () => {
    const catalog = await loadCatalog();

    const scenario: ScenarioFrame = {
      ...makeValidCareGuiltScenario(),
      correctAnswer: "urgency",
    };

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toContain(
      "The scenario's correctAnswer must match the conceptual frame pressure."
    );
  });

  it("rejects when correctAnswer is not in choices", async () => {
    const catalog = await loadCatalog();

    const scenario: ScenarioFrame = {
      ...makeValidCareGuiltScenario(),
      choices: ["urgency", "flattery", "minimization"],
    };

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toContain(
      "The correct answer must appear in the answer choices."
    );
  });

  it("rejects missing evidence spans", async () => {
    const catalog = await loadCatalog();

    const scenario: ScenarioFrame = {
      ...makeValidCareGuiltScenario(),
      evidenceSpan: "",
    };

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toContain("Scenario must include an evidence span.");
  });

  it("rejects missing warrants", async () => {
    const catalog = await loadCatalog();

    const scenario: ScenarioFrame = {
      ...makeValidCareGuiltScenario(),
      warrant: "",
    };

    const errors = validateScenarioFrame(scenario, catalog);

    expect(errors).toContain("Scenario must include a warrant.");
  });
});