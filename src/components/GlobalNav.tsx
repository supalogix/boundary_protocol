import { NavLink } from "react-router";

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? "active" : "";
}

export function GlobalNav() {
  return (
    <nav className="globalNav">
      <NavLink to="/learn" className={navClass}>
        Learn
      </NavLink>

      <NavLink to="/play" className={navClass}>
        Play
      </NavLink>
    </nav>
  );
}