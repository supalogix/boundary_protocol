import type { Article } from "../domain/articleTypes";

type Props = {
  article: Article;
  onBack: () => void;
  onPlay?: () => void;
};

export function ArticleReader({ article, onBack, onPlay }: Props) {
  return (
    <article className="articleReader">
      <button className="backButton" onClick={onBack}>
        ← Back to Articles
      </button>

      <div className="articleHeader">
        <p className="eyebrow">{article.category}</p>
        <h1>{article.title}</h1>
        <p className="articleSummary">{article.summary}</p>

        <div className="tagRow">
          {article.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="articleBody">
        {article.body.map((block, index) => {
          if (block.type === "heading") {
            return <h2 key={index}>{block.text}</h2>;
          }

          if (block.type === "paragraph") {
            return <p key={index}>{block.text}</p>;
          }

          if (block.type === "callout") {
            return (
              <blockquote key={index} className="articleCallout">
                {block.text}
              </blockquote>
            );
          }

          if (block.type === "list") {
            return (
              <ul key={index}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          }

          return null;
        })}
      </div>

      {article.suggestedGame && onPlay && (
        <div className="articleAction">
          <p>
            Suggested next step: <strong>{article.suggestedGame}</strong>
          </p>
          <button onClick={onPlay}>Go to Game</button>
        </div>
      )}
    </article>
  );
}