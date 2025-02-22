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
    savedState.playedIndexes
  ) {
    // Temporary patch to support the green->blue rename
    const adjustedColors = savedState.colors.map((color) =>
      color === "green" ? "blue" : color,
    );
    return {
      ...savedState,
      colors: adjustedColors,
    };
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

  return {
    seed: seed,
    letters: letters,
    colors: colors,
    clueIndexes: clueIndexes,
    clueMatches: clueMatches,
    playedIndexes: [],
    hints: hints,
    result: "",
  };
}
