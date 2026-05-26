import type { DomainCatalog } from "../domain/types";
import type { ScenarioFrame } from "../domain/types";
import type { SentenceFunctionScenario } from "../domain/sentenceFunctionTypes";
import type { Taxonomy } from "../domain/taxonomyTypes";
import { validateScenarioFrame } from "../domain/validateScenarioFrame";
import { validateSentenceFunctionScenario } from "../domain/validateSentenceFunctionScenario";
import { loadPressureScenarioCategories } from "./BrowserPressureScenarioCategoryProvider";

function withBasePath(path: string): string {
  const base = import.meta.env.BASE_URL;
  return `${base}${path.replace(/^\//, "")}`;
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(withBasePath(path));

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  return (await response.json()) as T;
}

//async function fetchJson<T>(url: string): Promise<T> {
//  const response = await fetch(url);
//
//  if (!response.ok) {
//    throw new Error(`Failed to fetch ${url}: ${response.status}`);
//  }
//
//  return (await response.json()) as T;
//}

export async function loadDomainCatalog(): Promise<DomainCatalog> {
  return fetchJson<DomainCatalog>("/data/catalogs/domainCatalog.json");
}

export async function loadPressureScenarios(): Promise<ScenarioFrame[]> {
  const [catalog, pressureCategories, scenarios] = await Promise.all([
    loadDomainCatalog(),
    loadPressureScenarioCategories(),
    fetchJson<ScenarioFrame[]>("/data/scenarios.json"),
  ]);

  const errors: string[] = [];
  const categoryIds = new Set(pressureCategories.map((category) => category.id));

  for (const scenario of scenarios) {
    const scenarioErrors = validateScenarioFrame(scenario, catalog);

    for (const error of scenarioErrors) {
      errors.push(`[${scenario.id}] ${error}`);
    }

    for (const categoryId of scenario.scenarioCategories ?? []) {
      if (!categoryIds.has(categoryId)) {
        errors.push(
          `[${scenario.id}] Unknown scenario category "${categoryId}".`
        );
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(["Pressure scenario validation failed:", ...errors].join("\n"));
  }

  return scenarios;
}

export async function loadSentenceFunctionScenarios(): Promise<
  SentenceFunctionScenario[]
> {
  const scenarios = await fetchJson<SentenceFunctionScenario[]>(
    "/data/sentenceFunctionScenarios.json"
  );

  const errors: string[] = [];

  for (const scenario of scenarios) {
    const scenarioErrors = validateSentenceFunctionScenario(scenario);

    for (const error of scenarioErrors) {
      errors.push(`[${scenario.id}] ${error}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      ["Sentence-function scenario validation failed:", ...errors].join("\n")
    );
  }

  return scenarios;
}

export async function loadTaxonomy(): Promise<Taxonomy> {
  return fetchJson<Taxonomy>("/data/taxonomy.json");
}