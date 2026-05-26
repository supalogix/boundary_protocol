import { useEffect, useMemo, useState } from "react";
import { QuestionBlock } from "../../components/QuestionBlock";
import { SentenceFunctionEngine } from "../../engine/SentenceFunctionEngine";
import type { SentenceFunctionScenario } from "../../domain/sentenceFunctionTypes";
import type { TaxonomyCategory } from "../../domain/taxonomyTypes";
import { shuffleArray } from "../../domain/shuffleArray";
import { SentenceFunctionComplete } from "./SentenceFunctionComplete";

type Props = {
  taxonomyCategory: TaxonomyCategory;
  scenarios: SentenceFunctionScenario[];
};

export function SentenceFunctionGame({ taxonomyCategory, scenarios }: Props) {
  const [questionSet, setQuestionSet] = useState<SentenceFunctionScenario[]>([]);
  const [index, setIndex] = useState(0);
  const [surfaceChoiceId, setSurfaceChoiceId] = useState<string | null>(null);
  const [functionChoiceId, setFunctionChoiceId] = useState<string | null>(null);
  const [countermoveChoiceId, setCountermoveChoiceId] = useState<string | null>(
    null
  );
  const [totalScore, setTotalScore] = useState(0);
  const [events, setEvents] = useState<unknown[]>([]);

  const scenarioKey = `${taxonomyCategory.id}:${scenarios
    .map((scenario) => scenario.id)
    .join("|")}`;

  const scenario = questionSet[index];

  useEffect(() => {
    setQuestionSet(shuffleArray(scenarios));
    setIndex(0);
    setSurfaceChoiceId(null);
    setFunctionChoiceId(null);
    setCountermoveChoiceId(null);
    setTotalScore(0);
    setEvents([]);
  }, [scenarioKey]);

  const result = useMemo(() => {
    if (
      !scenario ||
      !surfaceChoiceId ||
      !functionChoiceId ||
      !countermoveChoiceId
    ) {
      return null;
    }

    const engine = new SentenceFunctionEngine();

    engine.start(scenario);
    engine.submitAnswers({
      surfaceChoiceId,
      functionChoiceId,
      countermoveChoiceId,
    });
    engine.complete();

    return {
      state: engine.getState(),
      events: engine.getEvents(),
    };
  }, [scenario, surfaceChoiceId, functionChoiceId, countermoveChoiceId]);

  function next() {
    if (!result) {
      return;
    }

    const answerEvent = result.events.find(
      (event) =>
        typeof event === "object" &&
        event !== null &&
        "type" in event &&
        event.type === "SentenceFunctionRoundAnswered"
    ) as
      | {
          type: "SentenceFunctionRoundAnswered";
          totalScore: number;
        }
      | undefined;

    if (answerEvent) {
      setTotalScore((value) => value + answerEvent.totalScore);
    }

    setEvents((value) => [...value, ...result.events]);

    setSurfaceChoiceId(null);
    setFunctionChoiceId(null);
    setCountermoveChoiceId(null);
    setIndex((value) => value + 1);
  }

  function restart() {
    setQuestionSet(shuffleArray(scenarios));
    setIndex(0);
    setSurfaceChoiceId(null);
    setFunctionChoiceId(null);
    setCountermoveChoiceId(null);
    setTotalScore(0);
    setEvents([]);
  }

  if (scenarios.length === 0) {
    return (
      <section className="panel">
        <h2>No scenarios for {taxonomyCategory.label}</h2>
        <p>Add scenarios with taxonomy tag: {taxonomyCategory.id}</p>
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
      <SentenceFunctionComplete
        label={taxonomyCategory.label}
        totalScore={totalScore}
        maxScore={questionSet.length * 100}
        events={events}
        onRestart={restart}
      />
    );
  }

  return (
    <section className="panel game">
      <p className="eyebrow">
        {taxonomyCategory.label} · Question {index + 1} of {questionSet.length}
      </p>

      <h2>What Is the Sentence Doing?</h2>

      <p>
        <strong>Context:</strong> {scenario.context}
      </p>

      <blockquote>{scenario.sentence}</blockquote>

      <QuestionBlock
        title="1. Surface Meaning"
        prompt={scenario.surfaceQuestion.prompt}
        choices={scenario.surfaceQuestion.choices}
        selectedChoiceId={surfaceChoiceId}
        disabled={surfaceChoiceId !== null}
        onSelect={setSurfaceChoiceId}
      />

      {surfaceChoiceId && (
        <QuestionBlock
          title="2. Functional Meaning"
          prompt={scenario.functionQuestion.prompt}
          choices={scenario.functionQuestion.choices}
          selectedChoiceId={functionChoiceId}
          disabled={functionChoiceId !== null}
          onSelect={setFunctionChoiceId}
        />
      )}

      {functionChoiceId && (
        <QuestionBlock
          title="3. Countermove"
          prompt={scenario.countermoveQuestion.prompt}
          choices={scenario.countermoveQuestion.choices}
          selectedChoiceId={countermoveChoiceId}
          disabled={countermoveChoiceId !== null}
          onSelect={setCountermoveChoiceId}
        />
      )}

      {result && (
        <SentenceFunctionResult
          scenario={scenario}
          events={result.events}
          onNext={next}
        />
      )}
    </section>
  );
}

function SentenceFunctionResult({
  scenario,
  events,
  onNext,
}: {
  scenario: SentenceFunctionScenario;
  events: unknown[];
  onNext: () => void;
}) {
  const answerEvent = events.find(
    (event) =>
      typeof event === "object" &&
      event !== null &&
      "type" in event &&
      event.type === "SentenceFunctionRoundAnswered"
  ) as
    | {
        type: "SentenceFunctionRoundAnswered";
        surfaceCorrect: boolean;
        functionCorrect: boolean;
        countermoveCorrect: boolean;
        totalScore: number;
      }
    | undefined;

  if (!answerEvent) {
    return null;
  }

  return (
    <div className="feedback">
      <h3>Feedback</h3>

      <p>
        <strong>Surface:</strong>{" "}
        {answerEvent.surfaceCorrect ? "Correct" : "Incorrect"}
      </p>

      <p>
        <strong>Function:</strong>{" "}
        {answerEvent.functionCorrect ? "Correct" : "Incorrect"}
      </p>

      <p>
        <strong>Countermove:</strong>{" "}
        {answerEvent.countermoveCorrect ? "Correct" : "Incorrect"}
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
        <strong>Round score:</strong> {answerEvent.totalScore}/100
      </p>

      <button onClick={onNext}>Next</button>
    </div>
  );
}