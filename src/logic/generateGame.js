import seedrandom from "seedrandom";
import { letterPool } from "./letterPool";
import { shuffleArray } from "./shuffleArray";
import { arraysMatchQ } from "@skedwards88/word_logic";
import { findAllWordIndexes } from "@skedwards88/word_logic";
import { trie } from "./trie"

function getLetters(gridSize, pseudoRandomGenerator) {
  // Given the distribution of letters in the word list
  // Choose n letters without substitution
  const shuffledLetters = shuffleArray(letterPool, pseudoRandomGenerator);
  const chosenLetters = shuffledLetters.slice(0, gridSize * gridSize);

  return chosenLetters;
}

function tallyItems(items = []) {
  let tally = {};
  items.forEach((item) => (tally[item] = tally[item] ? tally[item] + 1 : 1));
  return tally;
}

export function getPlayableBoard({
  gridSize,
  minWordLength,
  maxWordLength,
  easyMode,
  numClues,
  seed,
}) {
  const colorDistribution = ["red", "green", "yellow"];
  let foundPlayableBoard = false;
  let letters = [];
  let colors = [];
  let clueIndexes = [];

  // Create a new seedable random number generator
  let pseudoRandomGenerator = seedrandom(seed);

  while (!foundPlayableBoard) {
    // Pick a random assortment of letters and colors
    letters = getLetters(gridSize, pseudoRandomGenerator);

    // If there are more than 3 of a single letter, restart
    // (It would be more efficient to do this as we draw,
    // but it's not a big loss to just check here.)
    const letterTally = tallyItems(letters);
    if (Object.values(letterTally).some((i) => i > 3)) {
      continue;
    }

    // make sure that we have at least 4 of each color
    let colorTally = {};
    while (
      Object.values(colorTally).length < colorDistribution.length ||
      Object.values(colorTally).some((i) => i < 4)
    ) {
      // Pick "random" colors
      colors = letters.map(
        () =>
          colorDistribution[
          Math.floor(pseudoRandomGenerator() * colorDistribution.length)
          ]
      );
      colorTally = tallyItems(colors);
    }

    // find all possible words
    const wordIndexes = findAllWordIndexes({
      grid: letters,
      minWordLength: minWordLength,
      maxWordLength: maxWordLength,
      easyMode: easyMode,
      trie: trie
    });
    const shuffledWordIndexes = shuffleArray(
      wordIndexes,
      pseudoRandomGenerator
    );

    // assemble the clues by going through each word and,
    // if the word/clue isn't too similar, add it to the clue list
    clueIndexes = [];
    for (let index = 0; index < shuffledWordIndexes.length; index++) {
      const currentClue = shuffledWordIndexes[index];

      // If the color pattern of the clue is already used, skip
      const currentClueColors = currentClue.map((index) => colors[index]);
      const foundCluesColors = clueIndexes.map((clue) =>
        clue.map((index) => colors[index])
      );
      const duplicateClue = foundCluesColors.some((array) =>
        arraysMatchQ(array, currentClueColors)
      );
      if (duplicateClue) {
        continue;
      }

      // If the first two letters, last two letters, or any stretch of 3 letters
      // is already used in another word of the same length, skip
      // (to keep answers from being too similar)
      const currentWord = currentClue.map((index) => letters[index]).join("");
      const foundCluesWords = clueIndexes.map((clue) =>
        clue.map((index) => letters[index]).join("")
      );
      const foundCluesWordsOfSameLength = foundCluesWords.filter(
        (clue) => clue.length === currentWord.length
      );

      let indexesToCompare = [];
      for (let index = 0; index <= currentWord.length - 2; index++) {
        if (index === 0) {
          indexesToCompare.push([index, index + 1]);
        } else if (index === currentWord.length - 2) {
          indexesToCompare.push([index, index + 1]);
        } else indexesToCompare.push([index, index + 1, index + 2]);
      }

      let tooSimilar = false;
      for (let index = 0; index < indexesToCompare.length; index++) {
        const comparisonIndex = indexesToCompare[index];
        const firstIndex = comparisonIndex[0];
        const lastIndex = comparisonIndex[comparisonIndex.length - 1] + 1;
        const comparisonSnippets = foundCluesWordsOfSameLength.map((i) =>
          i.slice(firstIndex, lastIndex)
        );
        if (
          comparisonSnippets.includes(currentWord.slice(firstIndex, lastIndex))
        ) {
          tooSimilar = true;
          break;
        }
      }
      if (tooSimilar) {
        continue;
      }

      // If the new word is a plural or singular of an existing word, skip
      // (This isn't covered by the above check, which only looks at clues of the same length)
      const foundCluesWordsLengthOffOne = foundCluesWords.filter(
        (clue) =>
          clue.length === currentWord.length + 1 ||
          clue.length === currentWord.length - 1
      );

      let pluralDuplicate = false;
      for (
        let comparisonIndex = 0;
        comparisonIndex < foundCluesWordsLengthOffOne.length;
        comparisonIndex++
      ) {
        if (
          foundCluesWordsLengthOffOne[comparisonIndex] + "S" === currentWord ||
          foundCluesWordsLengthOffOne[comparisonIndex] === currentWord + "S"
        ) {
          pluralDuplicate = true;
          break;
        }
      }
      if (pluralDuplicate) {
        continue;
      }

      clueIndexes.push(currentClue);

      // If found numClues, exit
      if (clueIndexes.length >= numClues) {
        foundPlayableBoard = true;
        break;
      }
    }
  }

  // Sort by clue length so longer clues are last
  clueIndexes.sort(function (a, b) {
    return a.length - b.length;
  });

  return [letters, colors, clueIndexes];
}
