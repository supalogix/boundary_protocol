import { Outlet } from "react-router";
import { Shell } from "../components/Shell";
import { GlobalNav } from "../components/GlobalNav";
import type { AppContent } from "../app/routeContext";

type Props = {
  content: AppContent;
};

export function RootLayout({ content }: Props) {
  return (
    <Shell>
      <header className="header">
        <div>
          <p className="eyebrow">Boundary Protocol</p>
          <h1>Learn the Concept. Then Test the Skill.</h1>
        </div>
      </header>

      <GlobalNav />

      <Outlet context={content} />
    </Shell>
  );
}