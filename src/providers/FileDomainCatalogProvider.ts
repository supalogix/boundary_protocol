import { readFile } from "node:fs/promises";
import path from "node:path";
import type { DomainCatalog } from "../domain/types";
import type { DomainCatalogProvider } from "./DomainCatalogProvider";

export class FileDomainCatalogProvider implements DomainCatalogProvider {
  constructor(private readonly filePath: string) {}

  async loadCatalog(): Promise<DomainCatalog> {
    const absolutePath = path.resolve(this.filePath);
    const raw = await readFile(absolutePath, "utf-8");

    try {
      return JSON.parse(raw) as DomainCatalog;
    } catch (error) {
      throw new Error(
        `Failed to parse domain catalog at ${absolutePath}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}