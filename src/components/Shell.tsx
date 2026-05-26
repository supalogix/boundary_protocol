import type { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return <main className="shell">{children}</main>;
}