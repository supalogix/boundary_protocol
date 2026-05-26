import type { ScenarioFrame } from "../domain/types";
import { careGuiltScenario } from "./careGuiltScenario";
import { careUrgencyScenario } from "./careUrgencyScenario";

export const scenarios: ScenarioFrame[] = [
  careGuiltScenario,
  careUrgencyScenario,
];