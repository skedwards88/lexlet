import { getSurroundingIndexes } from "./getSurroundingIndexes";

export function checkIfNeighbors({ indexA, indexB, gridSize }) {
  // Check if two indexes are neighbors in a grid
  // given the two indexes and the grid size
  // If only one index is provided, returns true

  if (indexA === undefined || indexB === undefined) {
    return true;
  }

  const surroundingIndexes = getSurroundingIndexes({
    index: indexB,
    gridSize: gridSize,
  });

  return surroundingIndexes.includes(indexA) ? true : false;
}
