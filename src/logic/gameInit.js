import {getPlayableBoard} from "./generateGame";

export function getSeed() {
  // Get a seed based on today's date 'YYYYMMDD'
  const currentDate = new Date();
  const seed = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${currentDate.getDate().toString().padStart(2, "0")}`;

  return seed;
}

function getWordLengthsForDay() {
  const today = new Date().getDay();

  const wordLengths = [
    [6, 7], // Sunday
    [4, 4],
    [4, 5],
    [4, 6],
    [5, 6],
    [5, 6],
    [6, 6],
  ];

  return wordLengths[today];
}

export function gameInit() {
  const seed = getSeed();

  const savedState = JSON.parse(localStorage.getItem("dailyLexletState"));

  // If today's game is in progress, keep the progress
  if (
    savedState &&
    savedState.seed === seed &&
    savedState.letters &&
    savedState.colors &&
    savedState.clueIndexes &&
    savedState.clueMatches &&
    savedState.hints &&
    savedState.playedIndexes &&
    savedState.stats
  ) {
    // Temporary patch to support the green->blue rename
    const adjustedColors = savedState.colors.map((color) =>
      color === "green" ? "blue" : color,
    );
    return {...savedState, colors: adjustedColors};
  }

  const gridSize = 4;
  const numClues = 5;
  const easyMode = true;
  const [minWordLength, maxWordLength] = getWordLengthsForDay();

  // Unlike the original version which returns a random game,
  //  this returns the one game per day based on the date
  const [letters, colors, clueIndexes] = getPlayableBoard({
    gridSize: gridSize,
    minWordLength: minWordLength,
    maxWordLength: maxWordLength,
    easyMode: easyMode,
    numClues: numClues,
    seed: seed,
  });

  const clueMatches = clueIndexes.map(() => false);
  const hints = clueIndexes.map((clue) => clue.map(() => false));

  // If there are already stats, use those
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
        0: {won: 0, noHints: 0}, // Sunday
        1: {won: 0, noHints: 0},
        2: {won: 0, noHints: 0},
        3: {won: 0, noHints: 0},
        4: {won: 0, noHints: 0},
        5: {won: 0, noHints: 0},
        6: {won: 0, noHints: 0},
      },
    };
  }

  return {
    seed: seed,
    letters: letters,
    colors: colors,
    clueIndexes: clueIndexes,
    clueMatches: clueMatches,
    playedIndexes: [],
    hints: hints,
    stats: stats,
    result: "",
  };
}
