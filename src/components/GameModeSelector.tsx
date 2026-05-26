import type { GameMode } from "../app/types";

type Props = {
  gameMode: GameMode;
  onChange: (mode: GameMode) => void;
};

export function GameModeSelector({ gameMode, onChange }: Props) {
  return (
    <section className="panel">
      <h2>Choose Game</h2>
      <div className="buttonRow">
        <button
          className={gameMode === "pressure" ? "active" : ""}
          onClick={() => onChange("pressure")}
        >
          Identify Pressure Pattern
        </button>

        <button
          className={gameMode === "sentence" ? "active" : ""}
          onClick={() => onChange("sentence")}
        >
          What Is the Sentence Doing?
        </button>
      </div>
    </section>
  );
}