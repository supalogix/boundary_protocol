import { describe, expect, it } from "vitest";
import { RoundEngine } from "../engine/RoundEngine";
import { FileDomainCatalogProvider } from "../providers/FileDomainCatalogProvider";
import { FileScenarioProvider } from "../providers/FileScenarioProvider";

async function loadScenarios() {
  const catalogProvider = new FileDomainCatalogProvider(
    "data/catalogs/domainCatalog.json"
  );

  const catalog = await catalogProvider.loadCatalog();

  const scenarioProvider = new FileScenarioProvider({
    filePath: "data/scenarios.json",
    catalog,
  });

  return scenarioProvider.loadScenarios();
}

describe("Identify Pressure Pattern - social unit test", () => {
  it("runs every file-backed scenario from round start to evidence-backed feedback", async () => {
    const scenarios = await loadScenarios();

    for (const scenario of scenarios) {
      const engine = new RoundEngine();

      engine.start(scenario);

      expect(engine.getState()).toMatchObject({
        status: "prompt",
        scenario,
      });

      engine.submitPressureChoice(scenario.correctAnswer);

      const state = engine.getState();

      expect(state.status).toBe("feedback");

      if (state.status !== "feedback") {
        throw new Error("Expected feedback state.");
      }

      expect(state.correct).toBe(true);
      expect(state.selected).toBe(scenario.correctAnswer);

      expect(state.claim).toMatchObject({
        type: "PRESSURE_IDENTIFIED",
        pressure: scenario.correctAnswer,
        evidenceSpan: scenario.evidenceSpan,
        warrant: scenario.warrant,
        threatensCondition: scenario.conceptualFrame.condition,
        distinctionAtRisk: scenario.conceptualFrame.distinction,
        scope: "current_scenario",
      });

      expect(engine.getEvents()).toContainEqual({
        type: "RoundStarted",
        scenarioId: scenario.id,
      });

      expect(engine.getEvents()).toContainEqual({
        type: "PressureIdentificationClaimCreated",
        scenarioId: scenario.id,
        pressure: scenario.correctAnswer,
        evidenceSpan: scenario.evidenceSpan,
        correct: true,
      });
    }
  });

  it("creates the correct claim even when the player chooses incorrectly", async () => {
    const scenarios = await loadScenarios();

    const urgencyScenario = scenarios.find(
      (scenario) => scenario.conceptualFrame.pressure === "urgency"
    );

    if (!urgencyScenario) {
      throw new Error("Expected at least one urgency scenario.");
    }

    const engine = new RoundEngine();

    engine.start(urgencyScenario);
    engine.submitPressureChoice("guilt");

    const state = engine.getState();

    expect(state.status).toBe("feedback");

    if (state.status !== "feedback") {
      throw new Error("Expected feedback state.");
    }

    expect(state.correct).toBe(false);
    expect(state.selected).toBe("guilt");
    expect(state.claim.pressure).toBe("urgency");
    expect(state.claim.evidenceSpan).toBe(urgencyScenario.evidenceSpan);
  });

  it("rejects pressure choices before the round has started", () => {
    const engine = new RoundEngine();

    expect(() => engine.submitPressureChoice("guilt")).toThrow(
      "Cannot submit pressure choice before prompt is ready."
    );
  });

  it("records round completion with the scenario id", async () => {
    const scenarios = await loadScenarios();
    const scenario = scenarios[0];

    const engine = new RoundEngine();

    engine.start(scenario);
    engine.submitPressureChoice(scenario.correctAnswer);
    engine.complete();

    expect(engine.getState()).toMatchObject({
      status: "complete",
    });

    expect(engine.getEvents()).toContainEqual({
      type: "RoundCompleted",
      scenarioId: scenario.id,
    });
  });
});