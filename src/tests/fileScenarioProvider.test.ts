import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { FileDomainCatalogProvider } from "../providers/FileDomainCatalogProvider";
import { FileScenarioProvider } from "../providers/FileScenarioProvider";
import type { DomainCatalog } from "../domain/types";

let tempDirs: string[] = [];

async function makeTempDir(): Promise<string> {
  const dir = await mkdtemp(path.join(os.tmpdir(), "boundary-console-test-"));
  tempDirs.push(dir);
  return dir;
}

afterEach(async () => {
  for (const dir of tempDirs) {
    await rm(dir, { recursive: true, force: true });
  }

  tempDirs = [];
});

async function loadCatalog(): Promise<DomainCatalog> {
  const provider = new FileDomainCatalogProvider(
    "data/catalogs/domainCatalog.json"
  );

  return provider.loadCatalog();
}

describe("FileScenarioProvider", () => {
  it("loads scenarios from the editable scenario file", async () => {
    const catalog = await loadCatalog();

    const provider = new FileScenarioProvider({
      filePath: "data/scenarios.json",
      catalog,
    });

    const scenarios = await provider.loadScenarios();

    expect(scenarios.length).toBeGreaterThan(0);
    expect(scenarios[0]).toHaveProperty("id");
    expect(scenarios[0]).toHaveProperty("conceptualFrame");
    expect(scenarios[0]).toHaveProperty("prompt");
  });

  it("throws a helpful error when the scenario file is not valid JSON", async () => {
    const catalog = await loadCatalog();
    const dir = await makeTempDir();
    const filePath = path.join(dir, "bad-scenarios.json");

    await writeFile(filePath, "{ not valid json", "utf-8");

    const provider = new FileScenarioProvider({
      filePath,
      catalog,
    });

    await expect(provider.loadScenarios()).rejects.toThrow(
      "Failed to parse scenario file"
    );
  });

  it("throws when the scenario file does not contain an array", async () => {
    const catalog = await loadCatalog();
    const dir = await makeTempDir();
    const filePath = path.join(dir, "not-array.json");

    await writeFile(
      filePath,
      JSON.stringify({ id: "not_an_array" }),
      "utf-8"
    );

    const provider = new FileScenarioProvider({
      filePath,
      catalog,
    });

    await expect(provider.loadScenarios()).rejects.toThrow(
      "Scenario file must contain an array of scenarios."
    );
  });

  it("throws semantic validation errors for invalid file-backed scenarios", async () => {
    const catalog = await loadCatalog();
    const dir = await makeTempDir();
    const filePath = path.join(dir, "invalid-scenarios.json");

    await writeFile(
      filePath,
      JSON.stringify(
        [
          {
            id: "invalid_wrong_distinction",
            mode: "identify_pressure_pattern",
            conceptualFrame: {
              value: "care",
              distinction: "forgiveness_not_permission",
              condition: "voluntariness_remains_possible",
              pressure: "guilt",
              test: "can_say_no_and_still_care",
              corruptedForm: "compliance",
              boundary: "do_not_help_under_emotional_coercion",
              protocol: "pause_help_protocol"
            },
            prompt: "After everything I've done for you, you can't help me once?",
            choices: ["guilt", "urgency", "flattery", "minimization"],
            correctAnswer: "guilt",
            explanation: "Bad scenario.",
            evidenceSpan: "After everything I've done for you",
            warrant: "The speaker frames refusal as moral failure."
          }
        ],
        null,
        2
      ),
      "utf-8"
    );

    const provider = new FileScenarioProvider({
      filePath,
      catalog,
    });

    await expect(provider.loadScenarios()).rejects.toThrow(
      "Scenario file failed semantic validation:"
    );

    await expect(provider.loadScenarios()).rejects.toThrow(
      '[invalid_wrong_distinction] Distinction "forgiveness_not_permission" does not belong to value "care".'
    );
  });
});