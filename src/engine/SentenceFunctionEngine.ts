import type {
  SentenceFunctionAnswerResult,
  SentenceFunctionScenario,
} from "../domain/sentenceFunctionTypes";

type SentenceFunctionState =
  | { status: "idle" }
  | { status: "prompt"; scenario: SentenceFunctionScenario }
  | {
      status: "feedback";
      scenario: SentenceFunctionScenario;
      surfaceChoiceId: string;
      functionChoiceId: string;
      countermoveChoiceId: string;
      result: SentenceFunctionAnswerResult;
    }
  | { status: "complete" };

type SentenceFunctionEvent =
  | { type: "SentenceFunctionRoundStarted"; scenarioId: string }
  | {
      type: "SentenceFunctionRoundAnswered";
      scenarioId: string;
      surfaceCorrect: boolean;
      functionCorrect: boolean;
      countermoveCorrect: boolean;
      totalScore: number;
    }
  | { type: "SentenceFunctionRoundCompleted"; scenarioId?: string };

export class SentenceFunctionEngine {
  private state: SentenceFunctionState = { status: "idle" };
  private events: SentenceFunctionEvent[] = [];

  start(scenario: SentenceFunctionScenario): void {
    this.state = { status: "prompt", scenario };

    this.events.push({
      type: "SentenceFunctionRoundStarted",
      scenarioId: scenario.id,
    });
  }

  submitAnswers(input: {
    surfaceChoiceId: string;
    functionChoiceId: string;
    countermoveChoiceId: string;
  }): void {
    if (this.state.status !== "prompt") {
      throw new Error("Cannot submit answers before prompt is ready.");
    }

    const scenario = this.state.scenario;

    const surfaceCorrect =
      input.surfaceChoiceId === scenario.surfaceQuestion.correctChoiceId;

    const functionCorrect =
      input.functionChoiceId === scenario.functionQuestion.correctChoiceId;

    const countermoveCorrect =
      input.countermoveChoiceId ===
      scenario.countermoveQuestion.correctChoiceId;

    const totalScore =
      (surfaceCorrect ? 25 : 0) +
      (functionCorrect ? 45 : 0) +
      (countermoveCorrect ? 30 : 0);

    const result: SentenceFunctionAnswerResult = {
      surfaceCorrect,
      functionCorrect,
      countermoveCorrect,
      totalScore,
    };

    this.state = {
      status: "feedback",
      scenario,
      surfaceChoiceId: input.surfaceChoiceId,
      functionChoiceId: input.functionChoiceId,
      countermoveChoiceId: input.countermoveChoiceId,
      result,
    };

    this.events.push({
      type: "SentenceFunctionRoundAnswered",
      scenarioId: scenario.id,
      surfaceCorrect,
      functionCorrect,
      countermoveCorrect,
      totalScore,
    });
  }

  complete(): void {
    const scenarioId =
      this.state.status === "prompt" || this.state.status === "feedback"
        ? this.state.scenario.id
        : undefined;

    this.state = { status: "complete" };

    this.events.push({
      type: "SentenceFunctionRoundCompleted",
      scenarioId,
    });
  }

  reset(): void {
    this.state = { status: "idle" };
  }

  getState(): SentenceFunctionState {
    return this.state;
  }

  getEvents(): SentenceFunctionEvent[] {
    return [...this.events];
  }
}