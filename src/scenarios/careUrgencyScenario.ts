import type { ScenarioFrame } from "../domain/types";

export const careUrgencyScenario: ScenarioFrame = {
  id: "care_urgency_answer_now",
  mode: "identify_pressure_pattern",

  context:
    "Someone wants you to make a decision before you have had time to think. They frame delay as something that will ruin the situation.",

  scenarioCategories: ["friendships"],

  conceptualFrame: {
    value: "care",
    distinction: "care_not_compliance",
    condition: "voluntariness_remains_possible",
    pressure: "urgency",
    test: "can_pause_before_answering",
    corruptedForm: "compliance",
    boundary: "do_not_help_under_time_coercion",
    protocol: "pause_help_protocol",
  },

  prompt: "I need an answer right now. If you wait, it'll be too late.",

  choices: ["guilt", "urgency", "flattery", "minimization"],

  correctAnswer: "urgency",

  explanation:
    "This is urgency pressure because it compresses decision time and makes pausing feel unavailable.",

  evidenceSpan: "I need an answer right now",

  warrant:
    "The speaker compresses decision time so pausing, reflecting, or refusing feels unavailable.",
};