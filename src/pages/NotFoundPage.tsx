import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <section className="panel">
      <h2>Page not found</h2>
      <p>This route does not exist.</p>
      <Link to="/learn">Go to Learn</Link>
    </section>
  );
}