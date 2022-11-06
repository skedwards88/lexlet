import gameCache from "./gameCache.json";

export function gameInit() {
  // Publish one puzzle per day
  const startDate = new Date("Sun Nov 06 2022 03:00:00"); // uses local timezone
  const nowInMilliSec = Date.now();
  const milliSecPerDay = 24 * 60 * 60 * 1000;
  const puzzleIndex = Math.floor((nowInMilliSec - startDate) / milliSecPerDay);

  // Loop through puzzles if we run out before uploading more
  const [letters, colors, clueIndexes] =
    gameCache[puzzleIndex] || gameCache[puzzleIndex % gameCache.length];

  const clueMatches = clueIndexes.map(() => false);
  const hints = clueIndexes.map((clue) => clue.map(() => false));

  return {
    letters: letters,
    colors: colors,
    clueIndexes: clueIndexes,
    clueMatches: clueMatches,
    playedIndexes: [],
    hints: hints,
  };
}
