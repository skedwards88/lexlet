import {
  commonWordsLen4,
  commonWordsLen5,
  commonWordsLen6,
  commonWordsLen7,
} from "@skedwards88/word_lists";

export function getLetterPool() {
  let letterDistribution = {};
  let totalLetters = 0;

  const words = [
    ...commonWordsLen4,
    ...commonWordsLen5,
    ...commonWordsLen6,
    ...commonWordsLen7
  ]

  // Get the letter counts
  for (let word of words) {
    const letters = word.split("");
    letters.forEach((letter) => {
      letterDistribution[letter] = letterDistribution[letter]
        ? (letterDistribution[letter] += 1)
        : 1;
      totalLetters += 1;
    });
  }

  // adjust for Qu
  const numQs = letterDistribution["Q"];
  const numUs = letterDistribution["U"];
  letterDistribution["U"] = numUs - numQs;
  letterDistribution["Qu"] = numQs;
  delete letterDistribution["Q"];

  // Remove some "s"s for plural bias
  // The .11 comes from:
  //   There are ~168676 "s" total
  //   About 74442 words ends in "s"
  //   Remove ~40% of that (18610)
  const numSs = letterDistribution["S"];
  letterDistribution["S"] = numSs - numSs * 0.11;

  // Convert the letter distribution to a rounded percentage, rounding up to 1
  const letterPercentages = {};
  for (let letter in letterDistribution) {
    letterPercentages[letter] = Math.max(
      1,
      Math.round(100 * (letterDistribution[letter] / totalLetters))
    );
  }

  // Based on the percentages, build out a representative list of letters
  let representativeLetters = [];
  for (let letter in letterPercentages) {
    const letters = Array(letterPercentages[letter]).fill(letter);
    representativeLetters = representativeLetters.concat(letters);
  }

  return representativeLetters;
}

export const letterPool = getLetterPool();
