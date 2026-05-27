import type { DomainCatalog } from "./types";
import type { ConceptualFrame, ScenarioFrame } from "./types";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function validateScenarioFrame(
  frame: Partial<ScenarioFrame>,
  catalog: DomainCatalog
): string[] {
  const errors: string[] = [];

  if (!isObject(frame)) {
    return ["Scenario must be an object."];
  }

  if (frame.mode !== "identify_pressure_pattern") {
    errors.push("Scenario must use identify_pressure_pattern mode.");
  }

  if (!isNonEmptyString(frame.id)) {
    errors.push("Scenario must include an id.");
  }

  if (!isNonEmptyString(frame.context)) {
    errors.push("Scenario must include context.");
  }

  if (
    frame.backgroundStory !== undefined &&
    typeof frame.backgroundStory !== "string"
  ) {
    errors.push("Scenario backgroundStory must be a string when provided.");
  }

  if (
    !Array.isArray(frame.scenarioCategories) ||
    frame.scenarioCategories.length === 0
  ) {
    errors.push("Scenario must include at least one scenario category.");
  }

  if (!isNonEmptyString(frame.prompt)) {
    errors.push("Scenario must include a prompt.");
  }

  if (!Array.isArray(frame.choices) || frame.choices.length < 2) {
    errors.push("Scenario must include at least two answer choices.");
  }

  if (!isNonEmptyString(frame.correctAnswer)) {
    errors.push("Scenario must include correctAnswer.");
  }

  if (!isNonEmptyString(frame.explanation)) {
    errors.push("Scenario must include explanation.");
  }

  if (!isNonEmptyString(frame.evidenceSpan)) {
    errors.push("Scenario must include an evidence span.");
  }

  if (!isNonEmptyString(frame.warrant)) {
    errors.push("Scenario must include a warrant.");
  }

  if (!isObject(frame.conceptualFrame)) {
    errors.push("Scenario must include conceptualFrame.");
    return errors;
  }

  const c = frame.conceptualFrame as Partial<ConceptualFrame>;

  if (!isNonEmptyString(c.value)) {
    errors.push("conceptualFrame must include value.");
  }

  if (!isNonEmptyString(c.distinction)) {
    errors.push("conceptualFrame must include distinction.");
  }

  if (!isNonEmptyString(c.condition)) {
    errors.push("conceptualFrame must include condition.");
  }

  if (!isNonEmptyString(c.pressure)) {
    errors.push("conceptualFrame must include pressure.");
  }

  if (!isNonEmptyString(c.test)) {
    errors.push("conceptualFrame must include test.");
  }

  if (!isNonEmptyString(c.corruptedForm)) {
    errors.push("conceptualFrame must include corruptedForm.");
  }

  if (!isNonEmptyString(c.boundary)) {
    errors.push("conceptualFrame must include boundary.");
  }

  if (!isNonEmptyString(c.protocol)) {
    errors.push("conceptualFrame must include protocol.");
  }

  // Stop here if the conceptual frame is structurally incomplete.
  // This prevents crashes like `Cannot read properties of undefined`.
  if (
    !isNonEmptyString(c.value) ||
    !isNonEmptyString(c.distinction) ||
    !isNonEmptyString(c.condition) ||
    !isNonEmptyString(c.pressure) ||
    !isNonEmptyString(c.test) ||
    !isNonEmptyString(c.corruptedForm) ||
    !isNonEmptyString(c.boundary) ||
    !isNonEmptyString(c.protocol)
  ) {
    return errors;
  }

  const value = catalog.values[c.value];
  const distinction = catalog.distinctions[c.distinction];
  const condition = catalog.conditions[c.condition];
  const pressure = catalog.pressures[c.pressure];
  const boundary = catalog.boundaries[c.boundary];
  const protocol = catalog.protocols[c.protocol];
  const test = catalog.tests[c.test];

  if (!value) {
    errors.push(`Unknown value: ${c.value}`);
  }

  if (!distinction) {
    errors.push(`Unknown distinction: ${c.distinction}`);
  }

  if (!condition) {
    errors.push(`Unknown condition: ${c.condition}`);
  }

  if (!pressure) {
    errors.push(`Unknown pressure: ${c.pressure}`);
  }

  if (!boundary) {
    errors.push(`Unknown boundary: ${c.boundary}`);
  }

  if (!protocol) {
    errors.push(`Unknown protocol: ${c.protocol}`);
  }

  if (!test) {
    errors.push(`Unknown test: ${c.test}`);
  }

  if (value && !value.distinctions.includes(c.distinction)) {
    errors.push(
      `Distinction "${c.distinction}" does not belong to value "${c.value}".`
    );
  }

  if (value && !value.corruptedForms.includes(c.corruptedForm)) {
    errors.push(
      `Corrupted form "${c.corruptedForm}" does not belong to value "${c.value}".`
    );
  }

  if (distinction && !distinction.preservedBy.includes(c.condition)) {
    errors.push(
      `Condition "${c.condition}" does not preserve distinction "${c.distinction}".`
    );
  }

  if (pressure && !pressure.threatens.includes(c.condition)) {
    errors.push(
      `Pressure "${c.pressure}" is not mapped as a threat to condition "${c.condition}".`
    );
  }

  if (boundary && !boundary.protects.includes(c.condition)) {
    errors.push(
      `Boundary "${c.boundary}" does not protect condition "${c.condition}".`
    );
  }

  if (protocol && !protocol.protects.includes(c.condition)) {
    errors.push(
      `Protocol "${c.protocol}" does not protect condition "${c.condition}".`
    );
  }

  if (protocol && !protocol.handlesPressures.includes(c.pressure)) {
    errors.push(
      `Protocol "${c.protocol}" does not handle pressure "${c.pressure}".`
    );
  }

  if (test && !test.reveals.includes(c.condition)) {
    errors.push(`Test "${c.test}" does not reveal condition "${c.condition}".`);
  }

  if (
    isNonEmptyString(frame.correctAnswer) &&
    frame.correctAnswer !== c.pressure
  ) {
    errors.push(
      "The scenario's correctAnswer must match the conceptual frame pressure."
    );
  }

  if (
    Array.isArray(frame.choices) &&
    isNonEmptyString(frame.correctAnswer) &&
    !frame.choices.includes(frame.correctAnswer)
  ) {
    errors.push("The correct answer must appear in the answer choices.");
  }

  return errors;
}