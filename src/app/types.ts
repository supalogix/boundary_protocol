import type { ScenarioFrame } from "../domain/types";
import type { SentenceFunctionScenario } from "../domain/sentenceFunctionTypes";
import type { Taxonomy } from "../domain/taxonomyTypes";
import type { Article } from "../domain/articleTypes";
import type { PressureScenarioCategory } from "../domain/pressureScenarioCategoryTypes";

export type AppSection = "learn" | "play";

export type GameMode = "pressure" | "sentence";

export type LoadState =
  | { status: "loading" }
  | {
      status: "ready";
      pressureScenarios: ScenarioFrame[];
      pressureCategories: PressureScenarioCategory[];
      sentenceScenarios: SentenceFunctionScenario[];
      taxonomy: Taxonomy;
      articles: Article[];
    }
  | { status: "error"; message: string };