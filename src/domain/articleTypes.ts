export type ArticleBlock =
  | {
      type: "heading";
      text: string;
    }
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "callout";
      text: string;
    }
  | {
      type: "list";
      items: string[];
    };

export type Article = {
  id: string;
  title: string;
  category: string;
  summary: string;
  tags: string[];
  suggestedGame?: string;
  body: ArticleBlock[];
};