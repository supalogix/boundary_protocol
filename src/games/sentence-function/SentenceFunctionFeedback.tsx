import type { SentenceFunctionScenario } from "../../domain/sentenceFunctionTypes";
import type { SentenceFunctionAnswerResult } from "../../domain/sentenceFunctionTypes";

type Props = {
  scenario: SentenceFunctionScenario;
  result: SentenceFunctionAnswerResult;
  onNext: () => void;
};

export function SentenceFunctionFeedback({ scenario, result, onNext }: Props) {
  return (
    <div className="feedback">
      <h3>Feedback</h3>

      <p>
        <strong>Surface:</strong>{" "}
        {result.surfaceCorrect ? "Correct" : "Incorrect"}
      </p>
      <p>
        <strong>Function:</strong>{" "}
        {result.functionCorrect ? "Correct" : "Incorrect"}
      </p>
      <p>
        <strong>Countermove:</strong>{" "}
        {result.countermoveCorrect ? "Correct" : "Incorrect"}
      </p>

      <hr />

      <p>
        <strong>Surface meaning:</strong> {scenario.surfaceMeaning}
      </p>
      <p>
        <strong>Functional meaning:</strong> {scenario.functionalMeaning}
      </p>
      <p>
        <strong>Hidden move:</strong> {scenario.hiddenMove}
      </p>
      <p>
        <strong>Counter-skill:</strong> {scenario.counterSkill}
      </p>
      <p>
        <strong>Example response:</strong> “{scenario.exampleResponse}”
      </p>
      <p>
        <strong>Unlocked:</strong> {scenario.unlockedFunctionCard}
      </p>
      <p>
        <strong>Round score:</strong> {result.totalScore}/100
      </p>

      <button onClick={onNext}>Next</button>
    </div>
  );
}