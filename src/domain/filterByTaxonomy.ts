export type TaggedScenario = {
  taxonomyTags: string[];
};

export function filterByTaxonomy<T extends TaggedScenario>(
  scenarios: T[],
  taxonomyId: string
): T[] {
  return scenarios.filter((scenario) =>
    scenario.taxonomyTags.includes(taxonomyId)
  );
}