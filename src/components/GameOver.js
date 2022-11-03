import React from "react";

function handleShare(result) {
  navigator
    .share({
      title: "Palette",
      text: result,
      url: "https://skedwards88.github.io/palette/",
    })
    .then(() => console.log("Successful share"))
    .catch((error) => console.log("Error sharing", error));
}

function handleCopy(result) {
  try {
    navigator.clipboard.writeText(result);
  } catch (error) {
    console.log(error);
  }
}

function resultToIcon({ hints, clueIndexes, colors }) {
  const boxTranslation = {
    red: "🟥",
    green: "🟦",
    yellow: "🟨",
    hint: "⬜",
  };

  let result = ""
  for (let clueIndex = 0; clueIndex < clueIndexes.length; clueIndex++) {
    result += "\n\n"
    for (
      let boxIndex = 0;
      boxIndex < clueIndexes[clueIndex].length;
      boxIndex++
    ) {
      if (hints[clueIndex][boxIndex]) {
        result += boxTranslation.hint;
      } else {
        const boardIndex = clueIndexes[clueIndex][boxIndex]
        result += boxTranslation[colors[boardIndex]];
      }
    }
  }
  return result;
}

export default function GameOver({ hints, clueIndexes, colors }) {
  const result = resultToIcon({ hints: hints, clueIndexes: clueIndexes, colors: colors });

  if (navigator.canShare) {
    return <button onClick={() => handleShare(result)}>Share</button>;
  } else {
    return <button onClick={() => handleCopy(result)}>Copy results</button>;
  }
}
