import { describe, expect, it } from "vitest";
import { SentenceFunctionEngine } from "../engine/SentenceFunctionEngine";
import { FileSentenceFunctionScenarioProvider } from "../providers/FileSentenceFunctionScenarioProvider";

async function loadScenarios() {
  const provider = new FileSentenceFunctionScenarioProvider({
    filePath: "data/sentenceFunctionScenarios.json",
  });

  return provider.loadScenarios();
}

describe("What Is the Sentence Doing - social unit test", () => {
  it("loads every sentence-function scenario", async () => {
    const scenarios = await loadScenarios();

    expect(scenarios.length).toBeGreaterThan(0);
  });

  it("runs every scenario from start to feedback with correct answers", async () => {
    const scenarios = await loadScenarios();

    for (const scenario of scenarios) {
      const engine = new SentenceFunctionEngine();

      engine.start(scenario);

      engine.submitAnswers({
        surfaceChoiceId: scenario.surfaceQuestion.correctChoiceId,
        functionChoiceId: scenario.functionQuestion.correctChoiceId,
        countermoveChoiceId: scenario.countermoveQuestion.correctChoiceId,
      });

      const state = engine.getState();

      expect(state.status).toBe("feedback");

      if (state.status !== "feedback") {
        throw new Error("Expected feedback state.");
      }

      expect(state.result.surfaceCorrect).toBe(true);
      expect(state.result.functionCorrect).toBe(true);
      expect(state.result.countermoveCorrect).toBe(true);
      expect(state.result.totalScore).toBe(100);

      expect(engine.getEvents()).toContainEqual({
        type: "SentenceFunctionRoundStarted",
        scenarioId: scenario.id,
      });

      expect(engine.getEvents()).toContainEqual({
        type: "SentenceFunctionRoundAnswered",
        scenarioId: scenario.id,
        surfaceCorrect: true,
        functionCorrect: true,
        countermoveCorrect: true,
        totalScore: 100,
      });
    }
  });

  it("scores partially correct answers", async () => {
    const scenarios = await loadScenarios();
    const scenario = scenarios[0];

    const wrongSurfaceChoice = scenario.surfaceQuestion.choices.find(
      (choice) => choice.id !== scenario.surfaceQuestion.correctChoiceId
    );

    if (!wrongSurfaceChoice) {
      throw new Error("Expected a wrong surface choice.");
    }

    const engine = new SentenceFunctionEngine();

    engine.start(scenario);

    engine.submitAnswers({
      surfaceChoiceId: wrongSurfaceChoice.id,
      functionChoiceId: scenario.functionQuestion.correctChoiceId,
      countermoveChoiceId: scenario.countermoveQuestion.correctChoiceId,
    });

    const state = engine.getState();

    expect(state.status).toBe("feedback");

    if (state.status !== "feedback") {
      throw new Error("Expected feedback state.");
    }

    expect(state.result.surfaceCorrect).toBe(false);
    expect(state.result.functionCorrect).toBe(true);
    expect(state.result.countermoveCorrect).toBe(true);
    expect(state.result.totalScore).toBe(75);
  });

  it("rejects answer submission before the round starts", () => {
    const engine = new SentenceFunctionEngine();

    expect(() =>
      engine.submitAnswers({
        surfaceChoiceId: "A",
        functionChoiceId: "B",
        countermoveChoiceId: "C",
      })
    ).toThrow("Cannot submit answers before prompt is ready.");
  });
});