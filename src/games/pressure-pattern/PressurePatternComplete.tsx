import { EventLogDetails } from "../../components/EventLogDetails";

type Props = {
  correctCount: number;
  total: number;
  events: unknown[];
  onRestart: () => void;
};

export function PressurePatternComplete({
  correctCount,
  total,
  events,
  onRestart,
}: Props) {
  return (
    <section className="panel">
      <h2>Complete</h2>
      <p>
        Score: {correctCount}/{total}
      </p>
      <button onClick={onRestart}>Restart</button>
      <EventLogDetails events={events} />
    </section>
  );
}