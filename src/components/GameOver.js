import React from "react";

function handleShare(result) {
  navigator
    .share({
      title: "Palette",
      text: result,
      url: "https://skedwards88.github.io/word_games/", // todo change url
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

export default function GameOver({ hints }) {
  const hintsUsed = hints.reduce(
    (accumulator, hint) => accumulator + hint.filter((i) => i).length,
    0
  );

  const result = `Solved with ${hintsUsed} hints.`; // todo change to icon representation
  if (navigator.canShare) {
    return <button onClick={() => handleShare(result)}>Share</button>;
  } else {
    return <button onClick={() => handleCopy(result)}>Copy results</button>;
  }
}
