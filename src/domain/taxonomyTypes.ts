export type TaxonomyCategory = {
  id: string;
  label: string;
  description: string;
  relatedPressures: string[];
  relatedFunctions: string[];
};

export type Taxonomy = {
  categories: TaxonomyCategory[];
};