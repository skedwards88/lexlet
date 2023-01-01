import React from "react";
import Share from "./Share";

function resultToIcon({ hints, preSeededHints, clueIndexes, colors }) {
  const boxTranslation = {
    red: "🟥",
    green: "🟦",
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
      if (
        hints[clueIndex][boxIndex] &&
        !(preSeededHints && preSeededHints[clueIndex][boxIndex])
      ) {
        result += boxTranslation.hint;
      } else {
        const boardIndex = clueIndexes[clueIndex][boxIndex];
        result += boxTranslation[colors[boardIndex]];
      }
    }
  }
  return result;
}

export default function GameOver({
  hints,
  preSeededHints,
  clueIndexes,
  colors,
}) {
  const result = resultToIcon({
    hints: hints,
    preSeededHints: preSeededHints,
    clueIndexes: clueIndexes,
    colors: colors,
  });

  return (
    <div id="gameOver">
      <Share text={result}></Share>
    </div>
  );
}
