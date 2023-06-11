import { getSurroundingIndexes } from "./getSurroundingIndexes";
import { isKnown } from "./isKnown";

export function findAllWordIndexes({
  grid,
  minWordLength,
  maxWordLength = 30,
  easyMode,
}) {
  let foundWordIndexes = [];

  const neighborIndexes = grid.map((_, index) =>
    getSurroundingIndexes({ index: index, gridSize: Math.sqrt(grid.length) })
  );

  function checkSurrounding(currentIndex, wordIndexes, visitedIndexes) {
    let surroundingIndexes = neighborIndexes[currentIndex];
    for (let surroundingIndex of surroundingIndexes) {
      // if the index has already been used, skip
      if (visitedIndexes.includes(surroundingIndex)) {
        continue;
      }
      const newWordIndexes = [...wordIndexes, surroundingIndex];
      const newWord = newWordIndexes.map((index) => grid[index]).join("");
      const { isPartial, isWord, isEasy } = isKnown(newWord);

      if (easyMode) {
        if (
          isEasy &&
          newWord.length >= minWordLength &&
          newWord.length <= maxWordLength
        ) {
          foundWordIndexes.push(newWordIndexes);
        }
      } else {
        if (
          isWord &&
          newWord.length >= minWordLength &&
          newWord.length <= maxWordLength
        ) {
          foundWordIndexes.push(newWordIndexes);
        }
      }
      if (isPartial) {
        checkSurrounding(
          surroundingIndex,
          newWordIndexes,
          visitedIndexes.concat(surroundingIndex)
        );
      }
    }
  }

  for (let startingIndex = 0; startingIndex < grid.length; startingIndex++) {
    checkSurrounding(startingIndex, [startingIndex], [startingIndex]);
  }

  return foundWordIndexes;
}

export function findAllWords({
  grid,
  minWordLength,
  maxWordLength = 30,
  easyMode,
}) {
  const foundWordIndexes = findAllWordIndexes({
    grid: grid,
    minWordLength: minWordLength,
    maxWordLength: maxWordLength,
    easyMode: easyMode,
  });
  const foundWords = foundWordIndexes.map((indexList) =>
    indexList.map((index) => grid[index]).join("")
  );
  const uniqueFoundWords = new Set(foundWords);

  return Array.from(uniqueFoundWords).sort();
}
