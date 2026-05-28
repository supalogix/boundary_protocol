import { useOutletContext } from "react-router";
import type { LoadState } from "./types";

export type AppContent = Extract<LoadState, { status: "ready" }>;

export function useAppContent(): AppContent {
  return useOutletContext<AppContent>();
}