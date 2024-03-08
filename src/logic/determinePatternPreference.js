export function determinePatternPreference(patternA, patternB, patternData) {
  // prefer lower sum similarity score
  if (
    patternData[patternA].sumSimilarityScore <
    patternData[patternB].sumSimilarityScore
  ) {
    return -1;
  } else if (
    patternData[patternA].sumSimilarityScore >
    patternData[patternB].sumSimilarityScore
  ) {
    return 1;
  }

  // then prefer the pattern with fewer solutions that end in "s"
  const patternANumS = Array.from(patternData[patternA].words).filter(
    (word) => word[word.length - 1] === "S",
  ).length;
  const patternBNumS = Array.from(patternData[patternB].words).filter(
    (word) => word[word.length - 1] === "S",
  ).length;
  if (patternANumS < patternBNumS) {
    return -1;
  } else if (patternANumS > patternBNumS) {
    return 1;
  }

  // then prefer more solutions
  if (
    patternData[patternA].indexes.length > patternData[patternB].indexes.length
  ) {
    return -1;
  } else if (
    patternData[patternA].indexes.length < patternData[patternB].indexes.length
  ) {
    return 1;
  }

  // then prefer the shorter pattern
  if (
    patternData[patternA].indexes[0].length <
    patternData[patternB].indexes[0].length
  ) {
    return -1;
  }
  return 1;
}
