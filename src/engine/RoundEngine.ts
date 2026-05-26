import type {
  DiagnosticClaim,
  PressureId,
  ScenarioFrame,
} from "../domain/types";
import { identifyPressure } from "../domain/identifyPressure";

type RoundState =
  | { status: "idle" }
  | { status: "prompt"; scenario: ScenarioFrame }
  | {
      status: "feedback";
      scenario: ScenarioFrame;
      selected: PressureId;
      correct: boolean;
      claim: DiagnosticClaim;
    }
  | { status: "complete" };

type Event =
  | { type: "RoundStarted"; scenarioId: string }
  | {
      type: "PressureIdentificationClaimCreated";
      scenarioId: string;
      pressure: PressureId;
      evidenceSpan: string;
      correct: boolean;
    }
  | { type: "RoundCompleted"; scenarioId?: string };

export class RoundEngine {
  private state: RoundState = { status: "idle" };
  private events: Event[] = [];

  start(scenario: ScenarioFrame): void {
    this.state = { status: "prompt", scenario };

    this.events.push({
      type: "RoundStarted",
      scenarioId: scenario.id,
    });
  }

  submitPressureChoice(choice: PressureId): void {
    if (this.state.status !== "prompt") {
      throw new Error("Cannot submit pressure choice before prompt is ready.");
    }

    const scenario = this.state.scenario;
    const result = identifyPressure(choice, scenario);

    this.state = {
      status: "feedback",
      scenario,
      selected: choice,
      correct: result.correct,
      claim: result.claim,
    };

    this.events.push({
      type: "PressureIdentificationClaimCreated",
      scenarioId: scenario.id,
      pressure: result.claim.pressure,
      evidenceSpan: result.claim.evidenceSpan,
      correct: result.correct,
    });
  }

  complete(): void {
    const scenarioId =
      this.state.status === "prompt" || this.state.status === "feedback"
        ? this.state.scenario.id
        : undefined;

    this.state = { status: "complete" };

    this.events.push({
      type: "RoundCompleted",
      scenarioId,
    });
  }

  reset(): void {
    this.state = { status: "idle" };
  }

  getState(): RoundState {
    return this.state;
  }

  getEvents(): Event[] {
    return [...this.events];
  }
}