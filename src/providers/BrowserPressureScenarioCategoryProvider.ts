import type {
  PressureScenarioCategory,
  PressureScenarioCategoryCatalog,
} from "../domain/pressureScenarioCategoryTypes";

function withBasePath(path: string): string {
  const base = import.meta.env.BASE_URL;
  return `${base}${path.replace(/^\//, "")}`;
}

export async function loadPressureScenarioCategories(): Promise<
  PressureScenarioCategory[]
> {
  const response = await fetch(
    withBasePath("data/pressureScenarioCategories.json")
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch pressure scenario categories: ${response.status}`
    );
  }

  const catalog = (await response.json()) as PressureScenarioCategoryCatalog;

  validatePressureScenarioCategories(catalog);

  return catalog.categories;
}

function validatePressureScenarioCategories(
  catalog: PressureScenarioCategoryCatalog
): void {
  if (!Array.isArray(catalog.categories)) {
    throw new Error("Pressure scenario category file must include categories.");
  }

  const ids = new Set<string>();

  for (const category of catalog.categories) {
    if (!category.id?.trim()) {
      throw new Error("Pressure scenario category is missing id.");
    }

    if (ids.has(category.id)) {
      throw new Error(`Duplicate pressure scenario category: ${category.id}`);
    }

    ids.add(category.id);

    if (!category.label?.trim()) {
      throw new Error(
        `Pressure scenario category "${category.id}" is missing label.`
      );
    }

    if (!category.description?.trim()) {
      throw new Error(
        `Pressure scenario category "${category.id}" is missing description.`
      );
    }
  }
}