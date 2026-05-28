import { Link, useParams } from "react-router";
import { useAppContent } from "../app/routeContext";
import { filterByScenarioCategory } from "../domain/filterByScenarioCategory";
import { PressurePatternGame } from "../games/pressure-pattern/PressurePatternGame";

export function PressureGameRoutePage() {
  const { categoryId } = useParams();
  const { pressureCategories, pressureScenarios } = useAppContent();

  const category = pressureCategories.find((item) => item.id === categoryId);

  if (!category) {
    return (
      <section className="panel">
        <h2>Pressure category not found</h2>
        <p>No pressure scenario category exists with id: {categoryId}</p>
        <Link to="/play/pressure">Back to Categories</Link>
      </section>
    );
  }

  const scenarios = filterByScenarioCategory(
    pressureScenarios,
    category.id
  );

  return (
    <>
      <section className="panel">
        <Link to="/play/pressure">← Back to Pressure Categories</Link>
        <p className="eyebrow">Identify Pressure Pattern</p>
        <h2>{category.label}</h2>
        <p>{category.description}</p>
      </section>

      <PressurePatternGame scenarios={scenarios} />
    </>
  );
}