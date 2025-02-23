export function getDifficultyLevelForDay() {
  const today = new Date().getDay();

  // Sunday is 0, but we want it to be 7 instead
  const difficultyLevel = today === 0 ? 7 : today;

  return difficultyLevel;
}
