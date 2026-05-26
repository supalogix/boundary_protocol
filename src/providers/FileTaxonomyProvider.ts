import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Taxonomy } from "../domain/taxonomyTypes";
import type { TaxonomyProvider } from "./TaxonomyProvider";

export class FileTaxonomyProvider implements TaxonomyProvider {
  constructor(private readonly filePath: string) {}

  async loadTaxonomy(): Promise<Taxonomy> {
    const absolutePath = path.resolve(this.filePath);
    const raw = await readFile(absolutePath, "utf-8");

    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      throw new Error(
        `Failed to parse taxonomy file at ${absolutePath}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    const taxonomy = parsed as Taxonomy;

    if (!Array.isArray(taxonomy.categories)) {
      throw new Error("Taxonomy file must contain a categories array.");
    }

    for (const category of taxonomy.categories) {
      if (!category.id?.trim()) {
        throw new Error("Taxonomy category is missing id.");
      }

      if (!category.label?.trim()) {
        throw new Error(`Taxonomy category "${category.id}" is missing label.`);
      }

      if (!category.description?.trim()) {
        throw new Error(
          `Taxonomy category "${category.id}" is missing description.`
        );
      }

      if (!Array.isArray(category.relatedPressures)) {
        throw new Error(
          `Taxonomy category "${category.id}" must include relatedPressures.`
        );
      }

      if (!Array.isArray(category.relatedFunctions)) {
        throw new Error(
          `Taxonomy category "${category.id}" must include relatedFunctions.`
        );
      }
    }

    return taxonomy;
  }
}