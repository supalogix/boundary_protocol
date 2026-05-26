export type ScenarioCategorized = {
  scenarioCategories: string[];
};

export function filterByScenarioCategory<T extends ScenarioCategorized>(
  scenarios: T[],
  categoryId: string
): T[] {
  return scenarios.filter((scenario) =>
    scenario.scenarioCategories.includes(categoryId)
  );
}