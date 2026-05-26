import { readFile } from "node:fs/promises";
import path from "node:path";
import type { DomainCatalog, ScenarioFrame } from "../domain/types";
import { validateScenarioFrame } from "../domain/validateScenarioFrame";
import type { ScenarioProvider } from "./ScenarioProvider";

type FileScenarioProviderOptions = {
  filePath: string;
  catalog: DomainCatalog;
};

export class FileScenarioProvider implements ScenarioProvider {
  private readonly filePath: string;
  private readonly catalog: DomainCatalog;

  constructor(options: FileScenarioProviderOptions) {
    this.filePath = options.filePath;
    this.catalog = options.catalog;
  }

  async loadScenarios(): Promise<ScenarioFrame[]> {
    const absolutePath = path.resolve(this.filePath);
    const raw = await readFile(absolutePath, "utf-8");

    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      throw new Error(
        `Failed to parse scenario file at ${absolutePath}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    if (!Array.isArray(parsed)) {
      throw new Error("Scenario file must contain an array of scenarios.");
    }

    const scenarios = parsed as ScenarioFrame[];
    const allErrors: string[] = [];

    for (const scenario of scenarios) {
      const errors = validateScenarioFrame(scenario, this.catalog);

      for (const error of errors) {
        allErrors.push(`[${scenario?.id ?? "unknown scenario"}] ${error}`);
      }
    }

    if (allErrors.length > 0) {
      throw new Error(
        ["Scenario file failed semantic validation:", ...allErrors].join("\n")
      );
    }

    return scenarios;
  }
}