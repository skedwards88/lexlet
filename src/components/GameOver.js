import React from "react";
import Share from "./Share";
import {calculateMixedColor} from "./Clues";
import {palette} from "./palette";

function resultToIcon({hints, clueIndexes, colors}) {
  const boxTranslation = {
    red: "🟥",
    blue: "🟦",
    yellow: "🟨",
    hint: "⬜",
  };

  let result = "";
  for (let clueIndex = 0; clueIndex < clueIndexes.length; clueIndex++) {
    result += "\n\n";
    for (
      let boxIndex = 0;
      boxIndex < clueIndexes[clueIndex].length;
      boxIndex++
    ) {
      if (hints[clueIndex][boxIndex]) {
        result += boxTranslation.hint;
      } else {
        const boardIndex = clueIndexes[clueIndex][boxIndex];
        result += boxTranslation[colors[boardIndex]];
      }
    }
  }
  return result;
}

function NewSwatches({newPaletteIndexes, swatchAnimationDestinationPosition}) {
  const swatchAnimatedRefs = [
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
  ];

  const [swatchAnimationDistance, setSwatchAnimationDistance] = React.useState(
    [],
  );

  React.useEffect(() => {
    const distances = swatchAnimatedRefs.map((ref) => {
      if (!ref.current || !swatchAnimationDestinationPosition) {
        return [0, 0];
      }
      const swatchAnimatedBox = ref.current.getBoundingClientRect();

      const distanceToMoveX =
        swatchAnimationDestinationPosition[0] -
        (swatchAnimatedBox.left + swatchAnimatedBox.width / 2);

      const distanceToMoveY =
        swatchAnimationDestinationPosition[1] -
        (swatchAnimatedBox.top + swatchAnimatedBox.height / 2);

      return [distanceToMoveX, distanceToMoveY];
    });

    setSwatchAnimationDistance(distances);
  }, [swatchAnimationDestinationPosition]); // Can ignore the warning about needing to include refs in the dep array

  if (!newPaletteIndexes.length) {
    return <></>;
  }

  return (
    <div>
      <p>{`${newPaletteIndexes.length} new color${
        newPaletteIndexes.length === 1 ? "" : "s"
      } discovered!`}</p>
      <div id="swatches">
        {newPaletteIndexes.map((swatchIndex, index) => (
          <div
            className="swatch"
            ref={swatchAnimatedRefs[index]}
            key={swatchIndex}
            style={{
              backgroundColor: `${calculateMixedColor(palette[swatchIndex])}`,
              ...(swatchAnimationDistance[index]?.length && {
                "--distanceX": `${swatchAnimationDistance[index][0]}px`,
                "--distanceY": `${swatchAnimationDistance[index][1]}px`,
                "--delay": `${2 + index / 5}s`,
              }),
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default function GameOver({
  hints,
  clueIndexes,
  colors,
  newPaletteIndexes,
  swatchAnimationDestinationPosition,
}) {
  const result = resultToIcon({
    hints: hints,
    clueIndexes: clueIndexes,
    colors: colors,
  });

  return (
    <div id="gameOver">
      <Share text={result}></Share>
      <NewSwatches
        newPaletteIndexes={newPaletteIndexes}
        swatchAnimationDestinationPosition={swatchAnimationDestinationPosition}
      ></NewSwatches>
    </div>
  );
}
