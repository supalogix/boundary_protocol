import { useEffect, useState } from "react";
import type { AppSection, GameMode } from "./app/types";
import { useGameContent } from "./app/useGameContent";
import { Shell } from "./components/Shell";
import { GlobalNav } from "./components/GlobalNav";
import { GameModeSelector } from "./components/GameModeSelector";
import { TaxonomySelector } from "./components/TaxonomySelector";
import { PressurePatternGame } from "./games/pressure-pattern/PressurePatternGame";
import { SentenceFunctionGame } from "./games/sentence-function/SentenceFunctionGame";
import { EducationSection } from "./education/EducationSection";
import { filterByTaxonomy } from "./domain/filterByTaxonomy";
import { PressureScenarioCategorySelector } from "./components/PressureScenarioCategorySelector";
import { filterByScenarioCategory } from "./domain/filterByScenarioCategory";

export function App() {
  const loadState = useGameContent();
  const [activeSection, setActiveSection] = useState<AppSection>("learn");
  const [gameMode, setGameMode] = useState<GameMode>("pressure");
  const [selectedTaxonomyId, setSelectedTaxonomyId] = useState<string | null>(
    null
  );
  const [selectedPressureCategoryId, setSelectedPressureCategoryId] =
  useState<string | null>(null);

  useEffect(() => {
    if (loadState.status === "ready" && selectedTaxonomyId === null) {
      setSelectedTaxonomyId(loadState.taxonomy.categories[0]?.id ?? null);
    }
  }, [loadState, selectedTaxonomyId]);

  useEffect(() => {
  if (loadState.status === "ready" && selectedTaxonomyId === null) {
    setSelectedTaxonomyId(loadState.taxonomy.categories[0]?.id ?? null);
  }

  if (loadState.status === "ready" && selectedPressureCategoryId === null) {
    setSelectedPressureCategoryId(
      loadState.pressureCategories[0]?.id ?? null
    );
  }
}, [loadState, selectedTaxonomyId, selectedPressureCategoryId]);

  if (loadState.status === "loading") {
    return <Shell>Loading content...</Shell>;
  }

  if (loadState.status === "error") {
    return (
      <Shell>
        <h1>Content Error</h1>
        <pre className="error">{loadState.message}</pre>
      </Shell>
    );
  }

  const selectedTaxonomy =
    loadState.taxonomy.categories.find(
      (category) => category.id === selectedTaxonomyId
    ) ?? loadState.taxonomy.categories[0];

    const selectedPressureCategory =
  loadState.pressureCategories.find(
    (category) => category.id === selectedPressureCategoryId
  ) ?? loadState.pressureCategories[0];

  return (
    <Shell>
      <header className="header">
        <div>
          <p className="eyebrow">Boundary Protocol</p>
          <h1>Learn the Concept. Then Test the Skill.</h1>
        </div>
      </header>

      <GlobalNav activeSection={activeSection} onChange={setActiveSection} />

      {activeSection === "learn" && (
        <EducationSection
          articles={loadState.articles}
          onPlay={() => setActiveSection("play")}
        />
      )}

      {activeSection === "play" && (
        <>
          <GameModeSelector gameMode={gameMode} onChange={setGameMode} />

{gameMode === "pressure" && (
  <>
    <PressureScenarioCategorySelector
      categories={loadState.pressureCategories}
      selectedCategoryId={selectedPressureCategory?.id ?? null}
      onSelect={setSelectedPressureCategoryId}
    />

    {selectedPressureCategory && (
      <PressurePatternGame
        scenarios={filterByScenarioCategory(
          loadState.pressureScenarios,
          selectedPressureCategory.id
        )}
      />
    )}
  </>
)}

          {gameMode === "sentence" && (
            <>
              <TaxonomySelector
                categories={loadState.taxonomy.categories}
                selectedTaxonomyId={selectedTaxonomy?.id ?? null}
                onSelect={setSelectedTaxonomyId}
              />

              {selectedTaxonomy && (
                <SentenceFunctionGame
                  taxonomyCategory={selectedTaxonomy}
                  scenarios={filterByTaxonomy(
                    loadState.sentenceScenarios,
                    selectedTaxonomy.id
                  )}
                />
              )}
            </>
          )}
        </>
      )}
    </Shell>
  );
}