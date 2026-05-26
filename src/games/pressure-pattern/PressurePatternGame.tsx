import { useEffect, useMemo, useState } from "react";
import { RoundEngine } from "../../engine/RoundEngine";
import type { ScenarioFrame } from "../../domain/types";
import { shuffleArray } from "../../domain/shuffleArray";
import { PressurePatternComplete } from "./PressurePatternComplete";

type Props = {
  scenarios: ScenarioFrame[];
};

export function PressurePatternGame({ scenarios }: Props) {
  const [questionSet, setQuestionSet] = useState<ScenarioFrame[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [events, setEvents] = useState<unknown[]>([]);

  const scenarioKey = scenarios.map((scenario) => scenario.id).join("|");
  const scenario = questionSet[index];

  useEffect(() => {
    setQuestionSet(shuffleArray(scenarios));
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setEvents([]);
  }, [scenarioKey]);

  const result = useMemo(() => {
    if (!scenario || !selected) {
      return null;
    }

    const engine = new RoundEngine();

    engine.start(scenario);
    engine.submitPressureChoice(selected);
    engine.complete();

    return {
      state: engine.getState(),
      events: engine.getEvents(),
    };
  }, [scenario, selected]);

  function next() {
    if (!result) {
      return;
    }

    const answerEvent = result.events.find(
      (event) =>
        typeof event === "object" &&
        event !== null &&
        "type" in event &&
        event.type === "PressureIdentificationClaimCreated"
    ) as
      | {
          type: "PressureIdentificationClaimCreated";
          correct: boolean;
        }
      | undefined;

    if (answerEvent?.correct) {
      setCorrectCount((value) => value + 1);
    }

    setEvents((value) => [...value, ...result.events]);
    setSelected(null);
    setIndex((value) => value + 1);
  }

  function restart() {
    setQuestionSet(shuffleArray(scenarios));
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setEvents([]);
  }

  if (scenarios.length === 0) {
    return (
      <section className="panel">
        <h2>No pressure-pattern scenarios found.</h2>
      </section>
    );
  }

  if (questionSet.length === 0) {
    return (
      <section className="panel">
        <h2>Preparing questions...</h2>
      </section>
    );
  }

  if (index >= questionSet.length) {
    return (
      <PressurePatternComplete
        correctCount={correctCount}
        total={questionSet.length}
        events={events}
        onRestart={restart}
      />
    );
  }

  return (
    <section className="panel game">
      <p className="eyebrow">
        Question {index + 1} of {questionSet.length}
      </p>

      <h2>Identify Pressure Pattern</h2>

      <p>
        <strong>Context:</strong> {scenario.context}
      </p>

      <blockquote>{scenario.prompt}</blockquote>

      <div className="choiceGrid">
        {scenario.choices.map((choice) => (
          <button
            key={choice}
            disabled={selected !== null}
            className={selected === choice ? "selected" : ""}
            onClick={() => setSelected(choice)}
          >
            {choice}
          </button>
        ))}
      </div>

      {selected && result && (
        <PressurePatternResult
          scenario={scenario}
          selected={selected}
          events={result.events}
          onNext={next}
        />
      )}
    </section>
  );
}

function PressurePatternResult({
  scenario,
  selected,
  events,
  onNext,
}: {
  scenario: ScenarioFrame;
  selected: string;
  events: unknown[];
  onNext: () => void;
}) {
  const answerEvent = events.find(
    (event) =>
      typeof event === "object" &&
      event !== null &&
      "type" in event &&
      event.type === "PressureIdentificationClaimCreated"
  ) as
    | {
        type: "PressureIdentificationClaimCreated";
        pressure: string;
        evidenceSpan: string;
        correct: boolean;
      }
    | undefined;

  const correct = answerEvent?.correct ?? selected === scenario.correctAnswer;

  return (
    <div className="feedback">
      <h3>{correct ? "Correct" : "Not quite"}</h3>

      <p>
        You chose <strong>{selected}</strong>.
      </p>

      <p>
        <strong>Correct pressure:</strong> {scenario.correctAnswer}
      </p>

      <p>
        <strong>Evidence:</strong> “{scenario.evidenceSpan}”
      </p>

      <p>
        <strong>Warrant:</strong> {scenario.warrant}
      </p>

      <p>
        <strong>Value:</strong> {scenario.conceptualFrame.value}
      </p>

      <p>
        <strong>Distinction at risk:</strong>{" "}
        {scenario.conceptualFrame.distinction}
      </p>

      <p>
        <strong>Condition threatened:</strong>{" "}
        {scenario.conceptualFrame.condition}
      </p>

      <p>{scenario.explanation}</p>

      <button onClick={onNext}>Next</button>
    </div>
  );
}