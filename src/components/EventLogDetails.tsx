type Props = {
  events: unknown[];
};

export function EventLogDetails({ events }: Props) {
  return (
    <details>
      <summary>Event Log</summary>
      <pre>{JSON.stringify(events, null, 2)}</pre>
    </details>
  );
}