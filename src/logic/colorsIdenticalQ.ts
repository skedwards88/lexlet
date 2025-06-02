import type {PrimaryColor} from "../Types";

function tallyColors(colors: PrimaryColor[]): Record<PrimaryColor, number> {
  return colors.reduce(
    (tally, currentColor) => {
      tally[currentColor]++;
      return tally;
    },
    {yellow: 0, red: 0, blue: 0},
  );
}

// Given two arrays of strings representing the primary colors ("yellow", "red", "blue")
// determine if the ratio of primary colors in the two arrays are identical
export function colorsIdenticalQ(
  colorsA: PrimaryColor[],
  colorsB: PrimaryColor[],
): boolean {
  const tallyA = tallyColors(colorsA);
  const tallyB = tallyColors(colorsB);

  const totalA = tallyA.yellow + tallyA.red + tallyA.blue;
  const totalB = tallyB.yellow + tallyB.red + tallyB.blue;

  if (totalA === 0 || totalB === 0) {
    return totalA === totalB;
  }

  return (
    tallyA.yellow / totalA === tallyB.yellow / totalB &&
    tallyA.red / totalA === tallyB.red / totalB &&
    tallyA.blue / totalA === tallyB.blue / totalB
  );
}
