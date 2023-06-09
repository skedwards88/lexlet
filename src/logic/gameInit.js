import gameCache from "./gameCache.json";

export const startDate = new Date("Mon May 29 2023 00:00:00"); // uses local timezone

export function getPuzzleIndex() {
  const nowInMilliSec = Date.now();
  const milliSecPerDay = 24 * 60 * 60 * 1000;
  const puzzleIndex = Math.floor((nowInMilliSec - startDate) / milliSecPerDay);
  return puzzleIndex;
}

export function gameInit() {
  // Publish one puzzle per day
  const puzzleIndex = getPuzzleIndex();

  const savedState = JSON.parse(localStorage.getItem("dailyPaletteState"));

  let stats;
  if (savedState && savedState.stats) {
    stats = savedState.stats;
  } else {
    stats = {
      // last puzzle index won (to calculate streak)
      lastDateWon: undefined,
      // consecutive games won
      streak: 0,
      // max consecutive games won
      maxStreak: 0,
      // of streak, games won without hints
      numHintlessInStreak: 0,
      // number of hints used during streak
      numHintsInStreak: 0,
      days: {
        // day: [total number of games won, total number of games won without hints]
        0: { won: 0, noHints: 0 }, // Sunday
        1: { won: 0, noHints: 0 },
        2: { won: 0, noHints: 0 },
        3: { won: 0, noHints: 0 },
        4: { won: 0, noHints: 0 },
        5: { won: 0, noHints: 0 },
        6: { won: 0, noHints: 0 },
      },
    };
  }

  if (savedState && savedState.puzzleIndex === puzzleIndex) {
    return { ...savedState, stats: stats };
  }

  // Loop through puzzles if we run out before uploading more
  const [letters, colorsAbbreviations, clueIndexes] =
    gameCache[puzzleIndex] || gameCache[puzzleIndex % gameCache.length];

  const colors = colorsAbbreviations.map((c) =>
    c.replace("R", "red").replace("Y", "yellow").replace("G", "green")
  );

  const clueMatches = clueIndexes.map(() => false);
  const hints = clueIndexes.map((clue) => clue.map(() => false));

  return {
    letters: letters,
    colors: colors,
    clueIndexes: clueIndexes,
    clueMatches: clueMatches,
    playedIndexes: [],
    hints: hints,
    stats: stats,
    // We could derive letters, colors, and clueIndexes from puzzleIndex instead of storing them in the state
    // but we aren't in order to simplify downstream code
    // and in order to make things slightly more robust to updates to the gameCache
    puzzleIndex: puzzleIndex,
  };
}
