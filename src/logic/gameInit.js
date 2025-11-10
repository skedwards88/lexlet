import {getPlayableBoard} from "./generateGame";
import {getSeedFromDate} from "@skedwards88/shared-components/src/logic/getSeedFromDate";
import {getRandomSeed} from "@skedwards88/shared-components/src/logic/getRandomSeed";
import {getDifficultyLevelForDay} from "@skedwards88/shared-components/src/logic/getDifficultyLevelForDay";

function getWordLengthsForLevel(level) {
  const wordLengths = [
    [4, 4],
    [4, 5],
    [4, 6],
    [5, 6],
    [5, 6],
    [6, 6],
    [6, 7],
  ];

  return wordLengths[level - 1];
}

export function gameInit({
  difficultyLevel,
  useSaved = true,
  isDaily = false,
  seed,
}) {
  if (isDaily) {
    seed = getSeedFromDate();
  }

  if (!seed) {
    seed = getRandomSeed();
  }

  const savedStateName = isDaily
    ? "lexletDailySavedState"
    : "lexletGameSavedState";

  let savedState = useSaved && JSON.parse(localStorage.getItem(savedStateName));

  // Temporary patch so people don't lose their progress
  // TODO This is only needed for a few playtesters and can be deleted after March 7, 2025
  // once deleted, change savedState from let to const
  if (isDaily && !savedState) {
    savedState = JSON.parse(localStorage.getItem("dailyLexletState"));
  }

  if (
    savedState &&
    savedState.seed &&
    // If daily, use the saved state if the seed matches
    // otherwise, we don't care if the seed matches
    (!isDaily || savedState.seed == seed) &&
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
      newPaletteIndexes: savedState.newPaletteIndexes || [],
    };
  }

  const gridSize = 4;
  const numClues = 5;
  const easyMode = true;
  difficultyLevel = isDaily
    ? getDifficultyLevelForDay()
    : difficultyLevel || savedState?.difficultyLevel || 3;
  const [minWordLength, maxWordLength] =
    getWordLengthsForLevel(difficultyLevel);

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
    seed,
    letters,
    colors,
    clueIndexes,
    clueMatches,
    playedIndexes: [],
    hints,
    result: "",
    newPaletteIndexes: [],
    difficultyLevel,
  };
}
