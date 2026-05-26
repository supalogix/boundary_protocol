import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const scenariosPath = path.resolve("data/scenarios.json");

const OLD_CATEGORY = "nightlife_adult_entertainment_workplace";
const NEW_CATEGORY = "adult_entertainment_workplace";

function unique(items) {
  return Array.from(new Set(items));
}

function normalizeScenarioCategories(scenario) {
  if (!Array.isArray(scenario.scenarioCategories)) {
    return scenario;
  }

  const updatedCategories = scenario.scenarioCategories.map((category) => {
    if (category === OLD_CATEGORY) {
      return NEW_CATEGORY;
    }

    return category;
  });

  return {
    ...scenario,
    scenarioCategories: unique(updatedCategories),
  };
}

function cleanContextText(scenario) {
  if (typeof scenario.context !== "string") {
    return scenario;
  }

  return {
    ...scenario,
    context: scenario.context.replaceAll(
      "nightlife or adult-entertainment workplace",
      "adult-entertainment workplace"
    ),
  };
}

async function main() {
  const raw = await readFile(scenariosPath, "utf-8");
  const scenarios = JSON.parse(raw);

  if (!Array.isArray(scenarios)) {
    throw new Error("data/scenarios.json must contain an array.");
  }

  const migrated = scenarios.map((scenario) =>
    cleanContextText(normalizeScenarioCategories(scenario))
  );

  await writeFile(scenariosPath, JSON.stringify(migrated, null, 2) + "\n");

  console.log(`Updated ${scenariosPath}`);
  console.log(`Replaced ${OLD_CATEGORY} -> ${NEW_CATEGORY}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});