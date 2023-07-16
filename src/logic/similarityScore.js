export function getSimilarityScore(word1, word2) {
  // if the words are exactly the same
  if (word1 === word2) return 1;

  // if the words are exactly the same if 's' is appended to either
  if (word1 + "S" === word2) return 1;
  if (word1 === word2 + "S") return 1;

  // If they share the first two letters
  if (word1.slice(0, 2) === word2.slice(0, 2)) return 0.5;

  // If they share the last two letters
  if (
    word1.slice(word1.length - 2, word1.length) ===
    word2.slice(word2.length - 2, word2.length)
  )
    return 0.5;

  // If they share any stretch of 3 letters
  // (We already checked the first two and first last, so we just need to check the middle of the word)
  let word1Triplets = [];
  for (let index = 0; index <= word1.length - 3; index++) {
    word1Triplets.push(word1.slice(index, index + 3));
  }
  for (let index = 0; index <= word2.length - 3; index++) {
    if (word1Triplets.includes(word2.slice(index, index + 3))) {
      return 0.5;
    }
  }

  return 0;
}

export function getMaxSimilarityScore(wordList1, wordList2) {
  let maxSimilarityScore = 0;
  for (let index1 = 0; index1 < wordList1.length; index1++) {
    for (let index2 = 0; index2 < wordList2.length; index2++) {
      const score = getSimilarityScore(wordList1[index1], wordList2[index2]);
      maxSimilarityScore = Math.max(maxSimilarityScore, score);
      if (maxSimilarityScore === 1) break;
    }
    if (maxSimilarityScore === 1) break;
  }
  return maxSimilarityScore;
}
