import type { TaxonomyCategory } from "../domain/taxonomyTypes";

type Props = {
  categories: TaxonomyCategory[];
  selectedTaxonomyId: string | null;
  onSelect: (id: string) => void;
};

export function TaxonomySelector({
  categories,
  selectedTaxonomyId,
  onSelect,
}: Props) {
  const selected =
    categories.find((category) => category.id === selectedTaxonomyId) ??
    categories[0];

  return (
    <section className="panel">
      <h2>Choose Sentence-Function Category</h2>

      <div className="taxonomyGrid">
        {categories.map((category) => (
          <button
            key={category.id}
            className={
              selected?.id === category.id ? "taxonomy active" : "taxonomy"
            }
            onClick={() => onSelect(category.id)}
          >
            <strong>{category.label}</strong>
            <span>{category.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}