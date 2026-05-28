import { Link, useParams } from "react-router";
import { useAppContent } from "../app/routeContext";
import { filterByTaxonomy } from "../domain/filterByTaxonomy";
import { SentenceFunctionGame } from "../games/sentence-function/SentenceFunctionGame";

export function SentenceGameRoutePage() {
  const { taxonomyId } = useParams();
  const { taxonomy, sentenceScenarios } = useAppContent();

  const category = taxonomy.categories.find((item) => item.id === taxonomyId);

  if (!category) {
    return (
      <section className="panel">
        <h2>Sentence-function category not found</h2>
        <p>No sentence-function taxonomy exists with id: {taxonomyId}</p>
        <Link to="/play/sentence">Back to Categories</Link>
      </section>
    );
  }

  const scenarios = filterByTaxonomy(sentenceScenarios, category.id);

  return (
    <>
      <section className="panel">
        <Link to="/play/sentence">← Back to Sentence Categories</Link>
        <p className="eyebrow">What Is the Sentence Doing?</p>
        <h2>{category.label}</h2>
        <p>{category.description}</p>
      </section>

      <SentenceFunctionGame taxonomyCategory={category} scenarios={scenarios} />
    </>
  );
}