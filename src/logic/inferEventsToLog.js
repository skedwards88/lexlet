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

  // If they used a hint
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

  // If they completed the game
  if (
    !oldState.clueMatches.every((i) => i) &&
    newState.clueMatches.every((i) => i)
  ) {
    analyticsToLog.push({
      eventName: "completed_game",
      eventInfo: {
        difficultyLevel: newState.difficultyLevel,
        isDaily: newState.isDaily,
        numHints: numNewHints,
      },
    });
  }

  // If they found an invalid word (and the word is > 3 letters)
  if (
    newState.lastInvalidWord &&
    newState.lastInvalidWord.length > 3 &&
    newState.lastInvalidWord != oldState.lastInvalidWord
  ) {
    analyticsToLog.push({
      eventName: "unknown_word",
      eventInfo: {
        word: newState.lastInvalidWord,
      },
    });
  }

  return analyticsToLog;
}
