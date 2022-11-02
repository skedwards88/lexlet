export function getSurroundingIndexes({ index, gridSize }) {
  const column = index % gridSize;
  const row = Math.floor(index / gridSize);
  let surroundingIndexes = [];
  for (let currentRow = row - 1; currentRow <= row + 1; currentRow++) {
    for (
      let currentColumn = column - 1;
      currentColumn <= column + 1;
      currentColumn++
    ) {
      if (
        currentRow >= 0 &&
        currentColumn >= 0 &&
        currentRow < gridSize &&
        currentColumn < gridSize
      ) {
        const currentIndex = currentColumn + currentRow * gridSize;
        surroundingIndexes.push(currentIndex);
      }
    }
  }
  return surroundingIndexes;
}
