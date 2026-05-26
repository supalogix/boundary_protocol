import type { AppSection } from "../app/types";

type Props = {
  activeSection: AppSection;
  onChange: (section: AppSection) => void;
};

export function GlobalNav({ activeSection, onChange }: Props) {
  return (
    <nav className="globalNav">
      <button
        className={activeSection === "learn" ? "active" : ""}
        onClick={() => onChange("learn")}
      >
        Learn
      </button>

      <button
        className={activeSection === "play" ? "active" : ""}
        onClick={() => onChange("play")}
      >
        Play
      </button>
    </nav>
  );
}