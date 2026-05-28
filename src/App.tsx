import { Navigate, Route, Routes } from "react-router";
import { useGameContent } from "./app/useGameContent";
import { Shell } from "./components/Shell";
import { RootLayout } from "./layouts/RootLayout";

import { LearnIndexPage } from "./pages/LearnIndexPage";
import { ArticleDetailPage } from "./pages/ArticleDetailPage";
import { PlayIndexPage } from "./pages/PlayIndexPage";
import { PressureCategoryPage } from "./pages/PressureCategoryPage";
import { PressureGameRoutePage } from "./pages/PressureGameRoutePage";
import { SentenceTaxonomyPage } from "./pages/SentenceTaxonomyPage";
import { SentenceGameRoutePage } from "./pages/SentenceGameRoutePage";
import { NotFoundPage } from "./pages/NotFoundPage";

export function App() {
  const loadState = useGameContent();

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

  return (
    <Routes>
      <Route element={<RootLayout content={loadState} />}>
        <Route index element={<Navigate to="/learn" replace />} />

        <Route path="/learn" element={<LearnIndexPage />} />
        <Route path="/learn/:articleId" element={<ArticleDetailPage />} />

        <Route path="/play" element={<PlayIndexPage />} />

        <Route path="/play/pressure" element={<PressureCategoryPage />} />
        <Route
          path="/play/pressure/:categoryId"
          element={<PressureGameRoutePage />}
        />

        <Route path="/play/sentence" element={<SentenceTaxonomyPage />} />
        <Route
          path="/play/sentence/:taxonomyId"
          element={<SentenceGameRoutePage />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}