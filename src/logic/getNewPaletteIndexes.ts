import {palette} from "../components/palette";
import type {PrimaryColor} from "../Types";
import {colorsIdenticalQ} from "./colorsIdenticalQ";

export function getNewPaletteIndexes({
  previouslyCollectedIndexes,
  clueIndexes,
  boardColors,
}: {
  previouslyCollectedIndexes: number[];
  clueIndexes: number[][];
  boardColors: PrimaryColor[];
}): number[] {
  // Figure out which colors were made this game
  const colorsCreated = clueIndexes.map((indexes) =>
    indexes.map((index: number) => boardColors[index]),
  );

  const paletteIndexes = colorsCreated.map((colorCreated) =>
    palette.findIndex((color: PrimaryColor[]) =>
      colorsIdenticalQ(color, colorCreated),
    ),
  );

  const newPaletteIndexes = paletteIndexes.filter(
    (paletteIndex) => !previouslyCollectedIndexes.includes(paletteIndex),
  );

  return newPaletteIndexes;
}
