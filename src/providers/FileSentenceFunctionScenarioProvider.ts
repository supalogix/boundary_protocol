import { readFile } from "node:fs/promises";
import path from "node:path";
import type { SentenceFunctionScenario } from "../domain/sentenceFunctionTypes";
import { validateSentenceFunctionScenario } from "../domain/validateSentenceFunctionScenario";
import type { SentenceFunctionScenarioProvider } from "./SentenceFunctionScenarioProvider";

type FileSentenceFunctionScenarioProviderOptions = {
  filePath: string;
};

export class FileSentenceFunctionScenarioProvider
  implements SentenceFunctionScenarioProvider
{
  private readonly filePath: string;

  constructor(options: FileSentenceFunctionScenarioProviderOptions) {
    this.filePath = options.filePath;
  }

  async loadScenarios(): Promise<SentenceFunctionScenario[]> {
    const absolutePath = path.resolve(this.filePath);
    const raw = await readFile(absolutePath, "utf-8");

    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      throw new Error(
        `Failed to parse sentence-function scenario file at ${absolutePath}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    if (!Array.isArray(parsed)) {
      throw new Error(
        "Sentence-function scenario file must contain an array of scenarios."
      );
    }

    const scenarios = parsed as SentenceFunctionScenario[];
    const allErrors: string[] = [];

    for (const scenario of scenarios) {
      const errors = validateSentenceFunctionScenario(scenario);

      for (const error of errors) {
        allErrors.push(`[${scenario?.id ?? "unknown scenario"}] ${error}`);
      }
    }

    if (allErrors.length > 0) {
      throw new Error(
        [
          "Sentence-function scenario file failed validation:",
          ...allErrors,
        ].join("\n")
      );
    }

    return scenarios;
  }
}