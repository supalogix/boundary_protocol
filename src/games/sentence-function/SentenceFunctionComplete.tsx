import { EventLogDetails } from "../../components/EventLogDetails";

type Props = {
  label: string;
  totalScore: number;
  maxScore: number;
  events: unknown[];
  onRestart: () => void;
};

export function SentenceFunctionComplete({
  label,
  totalScore,
  maxScore,
  events,
  onRestart,
}: Props) {
  return (
    <section className="panel">
      <h2>Complete: {label}</h2>
      <p>
        Score: {totalScore}/{maxScore}
      </p>
      <button onClick={onRestart}>Restart Category</button>
      <EventLogDetails events={events} />
    </section>
  );
}