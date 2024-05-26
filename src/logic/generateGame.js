import seedrandom from "seedrandom";
import {letterPool} from "./letterPool";
import {shuffleArray} from "@skedwards88/word_logic";
import {findAllWordIndexes} from "@skedwards88/word_logic";
import {trie} from "./trie";
import {
  getMaxWordSimilarityScore,
  getColorSimilarityScore,
} from "./similarityScore";
import {determinePatternPreference} from "./determinePatternPreference";

function getLetters(gridSize, pseudoRandomGenerator) {
  // Given the distribution of letters in the word list
  // Choose n letters without substitution
  const shuffledLetters = shuffleArray(letterPool, pseudoRandomGenerator);
  const chosenLetters = shuffledLetters.slice(0, gridSize * gridSize);

  // If there is a "Qu" in the pool,
  // replace the letter above or below (depending on
  // the qu position) randomly with A/E/I/O
  // This skews the letter distribution a bit but
  // gives the Qu a better chance of being used
  const qIndex = chosenLetters.indexOf("Qu");
  if (qIndex > -1) {
    const replacementPosition =
      qIndex < (gridSize * gridSize) / 2
        ? qIndex + gridSize
        : qIndex - gridSize;
    const replacementLetter = shuffleArray(
      ["A", "E", "I", "O"],
      pseudoRandomGenerator,
    )[0];
    chosenLetters[replacementPosition] = replacementLetter;
  }

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
  const colorDistribution = ["red", "blue", "yellow"];
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
          ],
      );
      colorTally = tallyItems(colors);
    }

    const gridDimensions = Math.sqrt(letters.length);

    // find all possible words
    const wordIndexes = findAllWordIndexes({
      letters,
      numColumns: gridDimensions,
      numRows: gridDimensions,
      minWordLength,
      maxWordLength,
      easyMode,
      trie,
    });
    const shuffledWordIndexes = shuffleArray(
      wordIndexes,
      pseudoRandomGenerator,
    );

    // Right now, we have a list of word indexes, many of which use the same pattern
    // Consolidate data about each pattern into a dict with the patterns as the keys
    let patternData = {};
    for (const currentIndexes of shuffledWordIndexes) {
      const pattern = currentIndexes.map((index) => colors[index][0]).join("");
      const word = currentIndexes.map((index) => letters[index]).join("");
      if (!patternData[pattern]) {
        patternData[pattern] = {
          words: new Set(),
          indexes: [],
          similarityScores: {},
          sumSimilarityScore: 0,
        };
      }
      patternData[pattern].indexes.push(currentIndexes);
      patternData[pattern].words.add(word);
    }

    // For each pattern, find the similarity score compared to the other patterns
    const patterns = Object.keys(patternData);
    for (let index = 0; index < patterns.length; index++) {
      const pattern = patterns[index];
      for (
        let comparisonIndex = index + 1;
        comparisonIndex < patterns.length;
        comparisonIndex++
      ) {
        const comparisonPattern = patterns[comparisonIndex];

        const maxWordSimilarityScore = getMaxWordSimilarityScore(
          Array.from(patternData[pattern].words),
          Array.from(patternData[comparisonPattern].words),
        );

        const colorSimilarityScore = getColorSimilarityScore(
          pattern,
          comparisonPattern,
        );

        patternData[pattern].similarityScores[comparisonPattern] =
          maxWordSimilarityScore + colorSimilarityScore;
        patternData[comparisonPattern].similarityScores[pattern] =
          maxWordSimilarityScore + colorSimilarityScore;
      }

      const sumSimilarityScore = Object.values(
        patternData[pattern].similarityScores,
      ).reduce((currentSum, currentValue) => currentSum + currentValue, 0);
      patternData[pattern]["sumSimilarityScore"] = sumSimilarityScore;
    }

    let potentialPatterns = new Set(Object.keys(patternData));
    for (const pattern in patternData) {
      for (const comparisonPattern in patternData[pattern].similarityScores) {
        // If any pattern comparisons have a similarity score greater than .75
        if (patternData[pattern].similarityScores[comparisonPattern] > 0.75) {
          // omit the pattern with the higher sum similarity score
          if (
            patternData[pattern].sumSimilarityScore >
            patternData[comparisonPattern].sumSimilarityScore
          ) {
            potentialPatterns.delete(pattern);
          } else if (
            patternData[pattern].sumSimilarityScore <
            patternData[comparisonPattern].sumSimilarityScore
          ) {
            potentialPatterns.delete(comparisonPattern);
          } else {
            // if there is a tie, omit the one with the fewer indexes (least words)
            if (
              patternData[pattern].indexes.length <
              patternData[comparisonPattern].indexes.length
            ) {
              potentialPatterns.delete(pattern);
            } else {
              // if there is still a tie, just choose one to omit
              potentialPatterns.delete(comparisonPattern);
            }
          }
        }
      }
    }

    // If we don't have enough patterns, try again
    if (potentialPatterns.size < numClues) {
      continue;
    }

    // Order the potential patterns by similarity score (lower = better)
    // If two patterns have the same similarity score, favor the pattern with more solutions
    potentialPatterns = Array.from(potentialPatterns);
    potentialPatterns.sort((patternA, patternB) =>
      determinePatternPreference(patternA, patternB, patternData),
    );

    // Choose the first index of the first N patterns to be the "official" solution
    clueIndexes = potentialPatterns
      .slice(0, numClues)
      .map((pattern) => patternData[pattern].indexes[0]);

    // Sort by clue length so longer clues are last
    clueIndexes.sort(function (a, b) {
      return a.length - b.length;
    });

    // stop looking
    foundPlayableBoard = true;
  }

  return [letters, colors, clueIndexes];
}
