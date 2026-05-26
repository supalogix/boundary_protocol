import type { DomainCatalog } from "../domain/types";

export interface DomainCatalogProvider {
  loadCatalog(): Promise<DomainCatalog>;
}