import { Link } from "react-router";
import { useAppContent } from "../app/routeContext";

export function LearnIndexPage() {
  const { articles } = useAppContent();

  if (articles.length === 0) {
    return (
      <section className="panel">
        <h2>No articles found.</h2>
        <p>
          Add articles to <code>data/articles.json</code>.
        </p>
      </section>
    );
  }

  return (
    <section className="articleListingPage">
      <div className="articleListingHeader">
        <p className="eyebrow">Learn</p>
        <h2>Boundary Articles</h2>
        <p>
          Read a short article first, then move into the games to practice the
          skill.
        </p>
      </div>

      <div className="articleListingGrid">
        {articles.map((article) => (
          <Link
            key={article.id}
            className="articleListingCard"
            to={`/learn/${article.id}`}
          >
            <span className="eyebrow">{article.category}</span>
            <strong>{article.title}</strong>
            <p>{article.summary}</p>

            <div className="miniTagRow">
              {article.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="miniTag">
                  {tag}
                </span>
              ))}

              {article.tags.length > 4 && (
                <span className="miniTag">+{article.tags.length - 4}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}