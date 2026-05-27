import type { Article } from "../domain/articleTypes";

function withBasePath(path: string): string {
  const base = import.meta.env.BASE_URL;
  return `${base}${path.replace(/^\//, "")}`;
}

export async function loadArticles(): Promise<Article[]> {
  const response = await fetch(withBasePath("data/articles.json"));

  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.status}`);
  }

  const articles = (await response.json()) as Article[];

  validateArticles(articles);

  return articles;
}

function validateArticles(articles: Article[]): void {
  if (!Array.isArray(articles)) {
    throw new Error("Article file must contain an array.");
  }

  for (const article of articles) {
    if (!article.id?.trim()) {
      throw new Error("Article is missing id.");
    }

    if (!article.title?.trim()) {
      throw new Error(`Article "${article.id}" is missing title.`);
    }

    if (!article.summary?.trim()) {
      throw new Error(`Article "${article.id}" is missing summary.`);
    }

    if (!Array.isArray(article.body) || article.body.length === 0) {
      throw new Error(`Article "${article.id}" must include body blocks.`);
    }
  }
}