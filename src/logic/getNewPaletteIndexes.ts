import {palette} from "../components/palette";
import {colorsIdenticalQ} from "./colorsIdenticalQ";
import type {Color} from "./gameInit";

export function getNewPaletteIndexes({
  previouslyCollectedIndexes,
  clueIndexes,
  boardColors,
}: {
  previouslyCollectedIndexes: number[];
  clueIndexes: number[][];
  boardColors: Color[];
}): number[] {
  // Figure out which colors were made this game
  const colorsCreated = clueIndexes.map((indexes) =>
    indexes.map((index) => boardColors[index]),
  );

  const paletteIndexes = colorsCreated.map((colorCreated) =>
    palette.findIndex((color) => colorsIdenticalQ(color, colorCreated)),
  );

  const newPaletteIndexes = paletteIndexes.filter(
    (paletteIndex) => !previouslyCollectedIndexes.includes(paletteIndex),
  );

  return newPaletteIndexes;
}
