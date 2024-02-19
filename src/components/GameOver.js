import React from "react";
import Share from "./Share";

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

export default function GameOver({hints, clueIndexes, colors}) {
  const result = resultToIcon({
    hints: hints,
    clueIndexes: clueIndexes,
    colors: colors,
  });

  return (
    <div id="gameOver">
      <Share text={result}></Share>
    </div>
  );
}
