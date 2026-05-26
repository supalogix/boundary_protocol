import type { DiagnosticClaim, PressureId, ScenarioFrame } from "./types";

export function identifyPressure(
  selected: PressureId,
  scenario: ScenarioFrame
): {
  correct: boolean;
  claim: DiagnosticClaim;
} {
  const correct = selected === scenario.correctAnswer;

  return {
    correct,
    claim: {
      type: "PRESSURE_IDENTIFIED",
      pressure: scenario.correctAnswer,
      evidenceSpan: scenario.evidenceSpan,
      warrant: scenario.warrant,
      threatensCondition: scenario.conceptualFrame.condition,
      distinctionAtRisk: scenario.conceptualFrame.distinction,
      scope: "current_scenario",
    },
  };
}