export function getColorSimilarityScore(pattern1, pattern2) {
  // If the patterns have the exact same number of each color, they have a non-zero similarity score

  const numR1 = pattern1.match(/r/g)?.length || 0;
  const numR2 = pattern2.match(/r/g)?.length || 0;
  if (numR1 != numR2) {
    return 0;
  }

  const numY1 = pattern1.match(/y/g)?.length || 0;
  const numY2 = pattern2.match(/y/g)?.length || 0;
  if (numY1 != numY2) {
    return 0;
  }

  const numB1 = pattern1.match(/b/g)?.length || 0;
  const numB2 = pattern2.match(/b/g)?.length || 0;
  if (numB1 != numB2) {
    return 0;
  }

  return 1;
}

export function getWordSimilarityScore(word1, word2) {
  // if the words are exactly the same
  if (word1 === word2) return 1;

  // if the words are exactly the same if 's' is appended to either
  if (word1 + "S" === word2) return 1;
  if (word1 === word2 + "S") return 1;

  // Calculate the fraction of the word that is the same starting at the first letter
  // e.g. COOK vs COOLING share the first 3 letters,
  // so the score for this is the average of 3/4 and 3/7
  const minWordLength = Math.min(word1.length, word2.length);
  let numSharedStartLetters = 0;
  for (let index = 0; index < minWordLength; index++) {
    if (word1[index] === word2[index]) {
      numSharedStartLetters++;
    } else {
      break;
    }
  }
  const startScore =
    (numSharedStartLetters / word1.length +
      numSharedStartLetters / word2.length) /
    2;

  // Do the same for the ending letters
  let numSharedEndLetters = 0;
  for (let index = 1; index <= minWordLength; index++) {
    if (word1[word1.length - index] === word2[word2.length - index]) {
      numSharedEndLetters++;
    } else {
      break;
    }
  }
  const endScore =
    (numSharedEndLetters / word1.length + numSharedEndLetters / word2.length) /
    2;

  // If they share any stretch of 4 letters
  let quadrupletScore = 0;
  let word1Quadruplets = [];
  for (let index = 0; index <= word1.length - 4; index++) {
    word1Quadruplets.push(word1.slice(index, index + 4));
  }
  for (let index = 0; index <= word2.length - 4; index++) {
    if (word1Quadruplets.includes(word2.slice(index, index + 4))) {
      quadrupletScore = (4 / word1.length + 4 / word2.length) / 2;
      break;
    }
  }

  // And if they share any stretch of 3 letters (if they don't already share 4 letters)
  let tripletScore = 0;
  if (quadrupletScore === 0) {
    let word1Triplets = [];
    for (let index = 0; index <= word1.length - 3; index++) {
      word1Triplets.push(word1.slice(index, index + 3));
    }
    for (let index = 0; index <= word2.length - 3; index++) {
      if (word1Triplets.includes(word2.slice(index, index + 3))) {
        tripletScore = (3 / word1.length + 3 / word2.length) / 2;
        break;
      }
    }
  }

  return Math.max(startScore, endScore, quadrupletScore, tripletScore);
}

export function getMaxWordSimilarityScore(wordList1, wordList2) {
  let maxSimilarityScore = 0;
  for (let index1 = 0; index1 < wordList1.length; index1++) {
    for (let index2 = 0; index2 < wordList2.length; index2++) {
      const score = getWordSimilarityScore(
        wordList1[index1],
        wordList2[index2],
      );
      maxSimilarityScore = Math.max(maxSimilarityScore, score);
      if (maxSimilarityScore === 1) break;
    }
    if (maxSimilarityScore === 1) break;
  }
  return maxSimilarityScore;
}
