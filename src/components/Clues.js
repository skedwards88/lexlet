import React from "react";

function Clue({
  clueColors,
  clueMatch,
  clueLetters,
  hint,
  dispatchGameState,
  clueIndex,
}) {
  const boxes = clueColors.map((color, index) => (
    <button
      className={`clueBox ${color}`}
      key={`${index}`}
      onClick={() =>
        dispatchGameState({
          action: "hint",
          clueIndex: clueIndex,
          boxIndex: index,
        })
      }
    >
      {hint[index] || clueMatch ? clueLetters[index].toUpperCase() : ""}
    </button>
  ));

  return <div className={`clue ${clueMatch ? "matched" : ""}`}>{boxes}</div>;
}

export default function Clues({
  clueColors,
  clueMatches,
  clueLetters,
  hints,
  dispatchGameState,
}) {
  const clueDisplays = clueColors.map((clue, index) => (
    <Clue
      clueColors={clueColors[index]}
      clueMatch={clueMatches[index]}
      clueLetters={clueLetters[index]}
      key={index}
      hint={hints[index]}
      dispatchGameState={dispatchGameState}
      clueIndex={index}
    ></Clue>
  ));

  return <div id="clues">{clueDisplays}</div>;
}
