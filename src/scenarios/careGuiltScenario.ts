import type { ScenarioFrame } from "../domain/types";

export const careGuiltScenario: ScenarioFrame = {
  id: "care_guilt_after_everything",
  mode: "identify_pressure_pattern",

  context:
    "You told a friend you cannot help them this weekend. They respond by questioning whether your refusal means you do not care.",

  scenarioCategories: ["friendships"],

  conceptualFrame: {
    value: "care",
    distinction: "care_not_compliance",
    condition: "voluntariness_remains_possible",
    pressure: "guilt",
    test: "can_say_no_and_still_care",
    corruptedForm: "compliance",
    boundary: "do_not_help_under_emotional_coercion",
    protocol: "pause_help_protocol",
  },

  prompt: "After everything I've done for you, you can't help me once?",

  choices: ["guilt", "urgency", "flattery", "minimization"],

  correctAnswer: "guilt",

  explanation:
    "This is guilt pressure because it frames refusal as moral failure or lack of care.",

  evidenceSpan: "After everything I've done for you",

  warrant:
    "The speaker frames refusal as moral failure or lack of care.",
};