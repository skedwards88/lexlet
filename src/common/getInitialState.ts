import type {DisplayState} from "../Types";

export function getInitialState(
  savedDisplayState: DisplayState,
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
