export function getInitialState(
  savedDisplayState,
  hasVisitedEver,
  hasVisitedSinceLastAnnouncement,
) {
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
