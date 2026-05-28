import { Link } from "react-router";

export function PlayIndexPage() {
  return (
    <section className="articleListingPage">
      <div className="articleListingHeader">
        <p className="eyebrow">Play</p>
        <h2>Choose a Game</h2>
        <p>
          Practice recognizing pressure patterns and sentence functions in
          realistic scenarios.
        </p>
      </div>

      <div className="articleListingGrid">
        <Link className="articleListingCard" to="/play/pressure">
          <span className="eyebrow">Game</span>
          <strong>Identify Pressure Pattern</strong>
          <p>
            Choose a real-life scenario type, then identify the pressure tactic
            being used.
          </p>
        </Link>

        <Link className="articleListingCard" to="/play/sentence">
          <span className="eyebrow">Game</span>
          <strong>What Is the Sentence Doing?</strong>
          <p>
            Choose a sentence-function category, then identify surface meaning,
            functional meaning, and countermove.
          </p>
        </Link>
      </div>
    </section>
  );
}