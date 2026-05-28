import { Link, useNavigate, useParams } from "react-router";
import { useAppContent } from "../app/routeContext";
import { ArticleReader } from "../education/ArticleReader";

export function ArticleDetailPage() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { articles } = useAppContent();

  const article = articles.find((item) => item.id === articleId);

  if (!article) {
    return (
      <section className="panel">
        <h2>Article not found</h2>
        <p>No article exists with id: {articleId}</p>
        <Link to="/learn">Back to Articles</Link>
      </section>
    );
  }

  return (
    <ArticleReader
      article={article}
      onBack={() => navigate("/learn")}
      onPlay={() => navigate("/play")}
    />
  );
}