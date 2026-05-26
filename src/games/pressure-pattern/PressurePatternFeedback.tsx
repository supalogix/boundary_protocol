import type { ScenarioFrame } from "../../domain/types";
import type { DiagnosticClaim } from "../../domain/types";

type Props = {
  correct: boolean;
  scenario: ScenarioFrame;
  claim: DiagnosticClaim;
  onNext: () => void;
};

export function PressurePatternFeedback({
  correct,
  scenario,
  claim,
  onNext,
}: Props) {
  return (
    <div className="feedback">
      <h3>{correct ? "Correct" : "Not quite"}</h3>

      <p>
        <strong>Correct pressure:</strong> {claim.pressure}
      </p>
      <p>
        <strong>Evidence:</strong> “{claim.evidenceSpan}”
      </p>
      <p>
        <strong>Warrant:</strong> {claim.warrant}
      </p>
      <p>
        <strong>Value:</strong> {scenario.conceptualFrame.value}
      </p>
      <p>
        <strong>Distinction at risk:</strong>{" "}
        {scenario.conceptualFrame.distinction}
      </p>
      <p>
        <strong>Condition threatened:</strong> {claim.threatensCondition}
      </p>
      <p>{scenario.explanation}</p>

      <button onClick={onNext}>Next</button>
    </div>
  );
}