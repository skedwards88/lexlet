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
