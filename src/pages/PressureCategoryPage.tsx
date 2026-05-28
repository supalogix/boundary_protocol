import { Link } from "react-router";
import { useAppContent } from "../app/routeContext";

export function PressureCategoryPage() {
  const { pressureCategories, pressureScenarios } = useAppContent();

  return (
    <section className="articleListingPage">
      <div className="articleListingHeader">
        <p className="eyebrow">Identify Pressure Pattern</p>
        <h2>Choose Real-Life Scenario Type</h2>
        <p>
          These categories organize questions around real settings: workplace,
          family, friendships, nightlife, spiritual abuse, community status, and
          coercive sexual power dynamics.
        </p>
      </div>

      <div className="articleListingGrid">
        {pressureCategories.map((category) => {
          const count = pressureScenarios.filter((scenario) =>
            scenario.scenarioCategories.includes(category.id)
          ).length;

          return (
            <Link
              key={category.id}
              className="articleListingCard"
              to={`/play/pressure/${category.id}`}
            >
              <span className="eyebrow">{count} scenarios</span>
              <strong>{category.label}</strong>
              <p>{category.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}