export function inferEventsToLog(oldState, newState) {
  let analyticsToLog = [];

  // If a new game was generated
  if (oldState.seed !== newState.seed) {
    analyticsToLog.push({
      eventName: "new_game",
      eventInfo: {
        isDaily: newState.isDaily,
        difficultyLevel: newState.difficultyLevel,
      },
    });
  }

  const numOldHints = oldState.hints
    .flat()
    .reduce(
      (numHints, currentValue) => (currentValue ? numHints + 1 : numHints),
      0,
    );
  const numNewHints = newState.hints
    .flat()
    .reduce(
      (numHints, currentValue) => (currentValue ? numHints + 1 : numHints),
      0,
    );

  if (numNewHints > numOldHints) {
    analyticsToLog.push({eventName: "hint"});
  }
  if (newState.clueMatches.every((i) => i)) {
    analyticsToLog.push({
      eventName: "completed_game",
      eventInfo: {
        difficultyLevel: newState.difficultyLevel,
        isDaily: newState.isDaily,
        numHints: numNewHints,
      },
    });
  }
  return analyticsToLog;
}
