import type {Stats} from "../Types";
import {updateStatStreaks} from "./updateStatStreaks";

export function statsInit(): Stats {
  const savedStats = JSON.parse(localStorage.getItem("lexletStats") ?? "null");

  if (savedStats) {
    // If stats are saved, use them
    return {
      ...savedStats,
      ...updateStatStreaks(savedStats),
      collectedSwatchIndexes: savedStats.collectedSwatchIndexes || [],
    };
  } else {
    // Temporary patch so people don't lose their acquired stats
    // TODO This is only needed for a few playtesters and can be deleted after March 7, 2025
    const savedState = JSON.parse(
      localStorage.getItem("dailyLexletState") ?? "null",
    );

    if (savedState?.stats) {
      return {
        ...updateStatStreaks(savedState.stats),
        collectedSwatchIndexes: savedState.stats.collectedSwatchIndexes || [],
      };
    }
    // End temp patch

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
