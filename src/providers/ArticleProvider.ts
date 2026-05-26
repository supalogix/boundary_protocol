import type { Article } from "../domain/articleTypes";

export interface ArticleProvider {
  loadArticles(): Promise<Article[]>;
}