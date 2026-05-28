import { Link } from "react-router";
import { useAppContent } from "../app/routeContext";

export function SentenceTaxonomyPage() {
  const { taxonomy, sentenceScenarios } = useAppContent();

  return (
    <section className="articleListingPage">
      <div className="articleListingHeader">
        <p className="eyebrow">What Is the Sentence Doing?</p>
        <h2>Choose Sentence-Function Category</h2>
        <p>
          These categories organize language by function: guilt, identity,
          urgency, desire/pacing, work power, and family obligation.
        </p>
      </div>

      <div className="articleListingGrid">
        {taxonomy.categories.map((category) => {
          const count = sentenceScenarios.filter((scenario) =>
            scenario.taxonomyTags.includes(category.id)
          ).length;

          return (
            <Link
              key={category.id}
              className="articleListingCard"
              to={`/play/sentence/${category.id}`}
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