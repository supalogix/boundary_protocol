import type { SentenceFunctionScenario } from "../domain/sentenceFunctionTypes";

export interface SentenceFunctionScenarioProvider {
  loadScenarios(): Promise<SentenceFunctionScenario[]>;
}