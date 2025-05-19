import {getPlayableBoard} from "./generateGame";
import getDailySeed from "../common/getDailySeed";
import getRandomSeed from "../common/getRandomSeed";
import {getDifficultyLevelForDay} from "../common/getDifficultyLevelForDay";
import type {GameState} from "../Types";

function getWordLengthsForLevel(level: number): [number, number] {
  const wordLengths: [number, number][] = [
    [4, 4],
    [4, 5],
    [4, 6],
    [5, 6],
    [5, 6],
    [6, 6],
    [6, 7],
  ];

  const result = wordLengths[level - 1];

  if (!result) {
    throw new Error(`Invalid level: ${level}`);
  }

  return result;
}

export function gameInit({
  difficultyLevel,
  useSaved = true,
  isDaily = false,
  seed,
}: {
  difficultyLevel?: number;
  useSaved?: boolean;
  isDaily?: boolean;
  seed?: string;
}): GameState {
  if (isDaily) {
    seed = getDailySeed();
  }

  if (!seed) {
    seed = getRandomSeed();
  }

  const savedStateName = isDaily
    ? "lexletDailySavedState"
    : "lexletGameSavedState";

  let savedState = useSaved
    ? (JSON.parse(localStorage.getItem(savedStateName) ?? "null") as GameState)
    : undefined;

  // Temporary patch so people don't lose their progress
  // TODO This is only needed for a few playtesters and can be deleted after March 7, 2025
  // once deleted, change savedState from let to const
  if (isDaily && !savedState) {
    savedState = JSON.parse(localStorage.getItem("dailyLexletState") ?? "null");
  }

  if (
    savedState?.seed &&
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
    return {
      ...savedState,
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

  const {letters, colors, clueIndexes} = getPlayableBoard({
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
