import type {Stats} from "../Types";
import {isYesterday, isToday} from "./isNDaysAgo";

export function updateStatStreaks(oldStats: Stats): Stats {
  const lastDatePlayed = oldStats.lastDatePlayed;

  // If played yesterday, add 1 to the streak
  // If played today, keep streak as is
  // Otherwise, reset the streak to 1
  let newStreak;
  if (lastDatePlayed && isYesterday(lastDatePlayed)) {
    newStreak = (oldStats.streak || 0) + 1;
  } else if (lastDatePlayed && isToday(lastDatePlayed)) {
    newStreak = oldStats.streak || 0;
  } else {
    newStreak = 1;
  }

  // Update the max streak if the new streak exceeds the current max streak
  const newMaxStreak = Math.max(newStreak, oldStats.maxStreak || 0);

  return {
    ...oldStats,
    lastDatePlayed: new Date().toISOString(),
    streak: newStreak,
    maxStreak: newMaxStreak,
  };
}
