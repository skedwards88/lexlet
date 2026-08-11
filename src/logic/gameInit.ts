import {getPlayableBoard} from "./generateGame";
import {getSeedFromDate} from "@skedwards88/shared-components/src/logic/getSeedFromDate";
import {getRandomSeed} from "@skedwards88/shared-components/src/logic/getRandomSeed";
import {getDifficultyLevelForDay} from "@skedwards88/shared-components/src/logic/getDifficultyLevelForDay";
import type {LetterQu} from "@skedwards88/word_logic/dist/Types";
import {getFromStorage} from "@skedwards88/shared-components/src/logic/safeStorage";

export type Color = "red" | "yellow" | "blue";

export type GameState = {
  seed: string;
  letters: LetterQu[];
  colors: Color[];
  clueIndexes: number[][];
  clueMatches: boolean[];
  playedIndexes: number[];
  hints: boolean[][];
  lastInvalidWord: string | null;
  newPaletteIndexes: number[];
  difficultyLevel: number;
  isDaily: boolean;
  isResumedFromSave: boolean;
  wordInProgress: boolean;
};

function getWordLengthsForLevel(level: number): number[] {
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
}: {
  difficultyLevel?: number;
  useSaved?: boolean;
  isDaily?: boolean;
  seed?: string | undefined;
}): GameState {
  if (isDaily) {
    seed = getSeedFromDate();
  }

  if (!seed) {
    seed = getRandomSeed();
  }

  const savedStateName = isDaily
    ? "lexletDailySavedState"
    : "lexletGameSavedState";

  const savedState = getFromStorage<GameState>(savedStateName);

  if (
    useSaved &&
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
      isResumedFromSave: true,
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
    lastInvalidWord: null,
    newPaletteIndexes: [],
    difficultyLevel,
    isDaily,
    isResumedFromSave: false,
    wordInProgress: false,
  };
}
