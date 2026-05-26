import type { PressureScenarioCategory } from "../domain/pressureScenarioCategoryTypes";

type Props = {
  categories: PressureScenarioCategory[];
  selectedCategoryId: string | null;
  onSelect: (categoryId: string) => void;
};

export function PressureScenarioCategorySelector({
  categories,
  selectedCategoryId,
  onSelect,
}: Props) {
  const selected =
    categories.find((category) => category.id === selectedCategoryId) ??
    categories[0];

  return (
    <section className="panel">
      <h2>Choose Real-Life Scenario Type</h2>

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