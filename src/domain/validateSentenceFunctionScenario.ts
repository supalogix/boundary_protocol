import type {
  SentenceFunctionQuestion,
  SentenceFunctionScenario,
} from "./sentenceFunctionTypes";

function validateQuestion(
  questionName: string,
  question: SentenceFunctionQuestion
): string[] {
  const errors: string[] = [];

  if (!question.prompt.trim()) {
    errors.push(`${questionName} must include a prompt.`);
  }

  if (!Array.isArray(question.choices) || question.choices.length < 2) {
    errors.push(`${questionName} must include at least two choices.`);
  }

  const ids = new Set<string>();

  for (const choice of question.choices) {
    if (!choice.id.trim()) {
      errors.push(`${questionName} has a choice with missing id.`);
    }

    if (!choice.text.trim()) {
      errors.push(`${questionName} choice "${choice.id}" has missing text.`);
    }

    if (ids.has(choice.id)) {
      errors.push(`${questionName} has duplicate choice id "${choice.id}".`);
    }

    ids.add(choice.id);
  }

  if (!ids.has(question.correctChoiceId)) {
    errors.push(
      `${questionName} correctChoiceId "${question.correctChoiceId}" is not one of the choices.`
    );
  }

  return errors;
}

export function validateSentenceFunctionScenario(
  scenario: SentenceFunctionScenario
): string[] {
  const errors: string[] = [];

  if (scenario.mode !== "what_is_sentence_doing") {
    errors.push("Scenario must use what_is_sentence_doing mode.");
  }

  if (!scenario.id.trim()) {
    errors.push("Scenario must include an id.");
  }

  if (!scenario.category.trim()) {
    errors.push("Scenario must include a category.");
  }

  if (!Number.isInteger(scenario.difficulty) || scenario.difficulty < 1) {
    errors.push("Scenario difficulty must be an integer >= 1.");
  }

  if (!scenario.context.trim()) {
    errors.push("Scenario must include context.");
  }

  if (!scenario.sentence.trim()) {
    errors.push("Scenario must include a sentence.");
  }

  errors.push(
    ...validateQuestion("surfaceQuestion", scenario.surfaceQuestion),
    ...validateQuestion("functionQuestion", scenario.functionQuestion),
    ...validateQuestion("countermoveQuestion", scenario.countermoveQuestion)
  );

  if (!scenario.surfaceMeaning.trim()) {
    errors.push("Scenario must include surfaceMeaning.");
  }

  if (!scenario.functionalMeaning.trim()) {
    errors.push("Scenario must include functionalMeaning.");
  }

  if (!scenario.hiddenMove.trim()) {
    errors.push("Scenario must include hiddenMove.");
  }

  if (!scenario.counterSkill.trim()) {
    errors.push("Scenario must include counterSkill.");
  }

  if (!scenario.exampleResponse.trim()) {
    errors.push("Scenario must include exampleResponse.");
  }

  if (!scenario.unlockedFunctionCard.trim()) {
    errors.push("Scenario must include unlockedFunctionCard.");
  }

  if (
    !Array.isArray(scenario.taxonomyTags) ||
    scenario.taxonomyTags.length === 0
  ) {
    errors.push("Scenario must include at least one taxonomy tag.");
  }

  return errors;
}