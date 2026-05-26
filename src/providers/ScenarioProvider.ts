import type { ScenarioFrame } from "../domain/types";

export interface ScenarioProvider {
  loadScenarios(): Promise<ScenarioFrame[]>;
}