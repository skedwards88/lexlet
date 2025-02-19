function isYesterday(timestamp) {
  return isNDaysAgo(timestamp, 1);
}

function isNDaysAgo(timestamp, numberOfDaysAgo) {
  const milliSecPerDay = 24 * 60 * 60 * 1000;
  const previousDay = new Date(Date.now() - numberOfDaysAgo * milliSecPerDay);
  const dateFromTimestamp = new Date(timestamp);

  return (
    dateFromTimestamp.getDate() === previousDay.getDate() &&
    dateFromTimestamp.getMonth() === previousDay.getMonth() &&
    dateFromTimestamp.getFullYear() === previousDay.getFullYear()
  );
}

export function updateStatStreaks(oldStats) {
  const today = new Date();
  const lastDatePlayed = oldStats.lastDatePlayed;
  const playedYesterday = isYesterday(lastDatePlayed);

  // If played yesterday, add 1 to the streak
  // Otherwise, reset the streak to 1
  const newStreak = playedYesterday ? oldStats.streak + 1 : 1;

  // Update the max streak if the new streak exceeds the current max streak
  const newMaxStreak = Math.max(newStreak, oldStats.maxStreak);

  return {
    ...oldStats,
    lastDatePlayed: today,
    streak: newStreak,
    maxStreak: newMaxStreak,
  };
}
