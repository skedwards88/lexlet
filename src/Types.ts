// Since the beforeinstallprompt event is experimental/nonstandard, the TS library doesn't have a type for it.
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;

  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;

  prompt: () => Promise<void>;
}

export type PrimaryColor = "red" | "yellow" | "blue";
export type Letter =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "QU"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";

export type Stats = {
  lastDatePlayed: string;
  streak: number;
  maxStreak: number;
  collectedSwatchIndexes: number[];
};

export type GameState = {
  seed: string;
  letters: Letter[];
  colors: PrimaryColor[];
  clueIndexes: number[][];
  clueMatches: boolean[];
  playedIndexes: number[];
  hints: boolean[][];
  result: string;
  newPaletteIndexes: number[];
  difficultyLevel: number;
  wordInProgress?: boolean;
};

export type GameReducerPayload =
  | {
      action: "startWord";
      letterIndex: number;
    }
  | {
      action: "hint";
      clueIndex: number;
      boxIndex: number;
    }
  | {
      action: "addLetter";
      letterIndex: number;
    }
  | {
      action: "removeLetter";
      letterIndex: number;
    }
  | {
      action: "endWord";
      collectedSwatchIndexes: number[];
    }
  | {
      action: "newGame";
      difficultyLevel?: number;
      isDaily?: boolean;
    };

export type PatternSimilarityDatum = {
  sumSimilarityScore: number;
  indexes: number[][];
  words: Set<string>;
};

export type DisplayState =
  | "rules"
  | "announcement"
  | "game"
  | "daily"
  | "settings"
  | "heart"
  | "stats";
