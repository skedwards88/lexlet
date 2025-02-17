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

function NewSwatches({newSwatchIndexes}) {
  if (!newSwatchIndexes.length) {
    return <></>;
  }

  return (
    <div>
      <p>{`${newSwatchIndexes.length} new color${
        newSwatchIndexes.length === 1 ? "" : "s"
      } discovered!`}</p>
      <div id="swatches">
        {newSwatchIndexes.map((swatchIndex) => (
          <div
            className="swatch"
            key={swatchIndex}
            style={{
              backgroundColor: `${calculateMixedColor(palette[swatchIndex])}`,
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
  newSwatchIndexes,
}) {
  const result = resultToIcon({
    hints: hints,
    clueIndexes: clueIndexes,
    colors: colors,
  });

  return (
    <div id="gameOver">
      <Share text={result}></Share>
      <NewSwatches newSwatchIndexes={newSwatchIndexes}></NewSwatches>
    </div>
  );
}
