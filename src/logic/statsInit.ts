import {updateStatStreaks} from "./updateStatStreaks";
import {getFromStorage} from "@skedwards88/shared-components/src/logic/safeStorage";

export type Stats = {
  // last date played (to calculate streak)
  lastDatePlayed: string;
  // consecutive days played
  streak: number;
  // max consecutive days played
  maxStreak: number;
  // indexes of the colors collected
  collectedSwatchIndexes: number[];
};

export function statsInit(): Stats {
  const savedStats = getFromStorage<Stats>("lexletStats");

  if (savedStats) {
    // If stats are saved, use them
    return {
      ...savedStats,
      ...updateStatStreaks(savedStats),
      collectedSwatchIndexes: savedStats.collectedSwatchIndexes || [],
    };
  } else {
    return {
      // last date played (to calculate streak)
      lastDatePlayed: new Date().toISOString(),
      // consecutive days played
      streak: 1,
      // max consecutive days played
      maxStreak: 1,
      // indexes of the colors collected
      collectedSwatchIndexes: [],
    };
  }
}
