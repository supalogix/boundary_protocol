import type { Taxonomy } from "../domain/taxonomyTypes";

export interface TaxonomyProvider {
  loadTaxonomy(): Promise<Taxonomy>;
}