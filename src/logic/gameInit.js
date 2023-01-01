import gameCache from "./gameCache.json";

export const startDate = new Date("Sun Nov 06 2022 03:00:00"); // uses local timezone

export function getPuzzleIndex() {
  const nowInMilliSec = Date.now();
  const milliSecPerDay = 24 * 60 * 60 * 1000;
  const puzzleIndex = Math.floor((nowInMilliSec - startDate) / milliSecPerDay);
  return puzzleIndex;
}

function getTotalNumHints() {
  const dayOfWeek = new Date().getDay();

  switch (dayOfWeek) {
    case 1: // Mon
      return 18;
    case 2: // Tues
      return 15;
    case 3: // Wed
      return 12;
    case 4: // Thurs
      return 9;
    case 5: // Fri
      return 6;
    case 6: // Sat
      return 3;
    case 0: // Sun
      return 0;
    default:
      return 0;
  }
}

function getPreSeededHints(totalNumHints) {
  const dayOfMonth = new Date().getDate();
  const numWords = 6;
  const wordLength = 6;

  let hints = [];
  for (let wordIndex = 0; wordIndex < numWords; wordIndex++) {
    let unusedHintIndexes = [0, 1, 2, 3, 4, 5];
    // Determine the hint spacing to use based on day of month + word index so that the spacing varies
    const spacing = 1 + ((wordIndex + dayOfMonth) % 6);

    const numHintsPerWord =
      wordIndex % 2
        ? Math.floor(totalNumHints / numWords)
        : Math.ceil(totalNumHints / numWords);

    // pick n random-appearing indexes
    let hintIndexesForWord = [];
    for (let hintNumber = 0; hintNumber < numHintsPerWord; hintNumber++) {
      // Change the starting position throughtout
      const start = hintIndexesForWord.length
        ? hintIndexesForWord[hintIndexesForWord.length - 1]
        : wordIndex;
      // decay the spacing to add some perceived randomness
      const decayedSpacing = Math.abs(spacing - hintNumber);
      const x = ((start % 5) + decayedSpacing) % unusedHintIndexes.length;
      // console.log(x)
      const hintIndex = unusedHintIndexes.splice(x, 1)[0];
      hintIndexesForWord.push(hintIndex);
    }
    // Convert the indexes into hints
    let hintsForWord = [];
    for (let letterIndex = 0; letterIndex < wordLength; letterIndex++) {
      if (hintIndexesForWord.includes(letterIndex)) {
        hintsForWord.push(true);
      } else {
        hintsForWord.push(false);
      }
    }

    hints.push(hintsForWord);
  }
  return hints;
}

export function gameInit() {
  // Publish one puzzle per day
  const puzzleIndex = getPuzzleIndex();

  const savedState = JSON.parse(localStorage.getItem("dailyPaletteState"));

  if (savedState && savedState.puzzleIndex === puzzleIndex) {
    return savedState;
  }

  // Loop through puzzles if we run out before uploading more
  const [letters, colorsAbbreviations, clueIndexes] =
    gameCache[puzzleIndex] || gameCache[puzzleIndex % gameCache.length];

  const colors = colorsAbbreviations.map((c) =>
    c.replace("R", "red").replace("Y", "yellow").replace("G", "green")
  );

  const clueMatches = clueIndexes.map(() => false);
  const numPreSeededHints = getTotalNumHints();
  const preSeededHints = getPreSeededHints(numPreSeededHints);

  return {
    letters: letters,
    colors: colors,
    clueIndexes: clueIndexes,
    clueMatches: clueMatches,
    playedIndexes: [],
    hints: preSeededHints,
    preSeededHints: preSeededHints,
    numPreSeededHints: numPreSeededHints,
    // We could derive letters, colors, and clueIndexes from puzzleIndex instead of storing them in the state
    // but we aren't in order to simplify downstream code
    // and in order to make things slightly more robust to updates to the gameCache
    puzzleIndex: puzzleIndex,
  };
}
