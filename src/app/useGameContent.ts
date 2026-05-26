import { useEffect, useState } from "react";
import type { LoadState } from "./types";
import {
  loadPressureScenarios,
  loadSentenceFunctionScenarios,
  loadTaxonomy,
} from "../providers/BrowserGameContentProvider";
import { loadArticles } from "../providers/BrowserArticleProvider";
import { loadPressureScenarioCategories } from "../providers/BrowserPressureScenarioCategoryProvider";

export function useGameContent() {

  const [loadState, setLoadState] = useState<LoadState>({
    status: "loading",
  });

  useEffect(() => {
    async function load() {
      try {
        const [
        pressureScenarios,
        pressureCategories,
        sentenceScenarios,
        taxonomy,
        articles,
        ] = await Promise.all([
        loadPressureScenarios(),
        loadPressureScenarioCategories(),
        loadSentenceFunctionScenarios(),
        loadTaxonomy(),
        loadArticles(),
        ]);

        setLoadState({
            status: "ready",
            pressureScenarios,
            pressureCategories,
            sentenceScenarios,
            taxonomy,
            articles,
        });
      } catch (error) {
        setLoadState({
          status: "error",
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }

    load();
  }, []);

  return loadState;
}