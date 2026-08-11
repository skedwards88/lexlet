import type {DisplayState} from "../components/App";

export function getInitialState(
  savedDisplayState: DisplayState | undefined,
  hasVisitedEver: boolean,
  hasVisitedSinceLastAnnouncement: boolean,
): DisplayState {
  if (!hasVisitedEver) {
    return "rules";
  }

  if (!hasVisitedSinceLastAnnouncement) {
    return "announcement";
  }

  if (savedDisplayState === "game" || savedDisplayState === "daily") {
    return savedDisplayState;
  }

  return "game";
}
