import React from "react";

function Clue({ clueColors, clueMatch, clueLetters, hintLevel }) {
  const boxes = clueColors.map((color, index) => (
    <div className={`clueBox ${color}`} key={`${index}`}>
      {index < hintLevel || clueMatch ? clueLetters[index].toUpperCase() : ""}
    </div>
  ));

  return <div className={`clue ${clueMatch ? "matched" : ""}`}>{boxes}</div>;
}

export default function Clues({
  clueColors,
  clueMatches,
  clueLetters,
  hintLevel,
}) {
  const clueDisplays = clueColors.map((clue, index) => (
    <Clue
      clueColors={clueColors[index]}
      clueMatch={clueMatches[index]}
      clueLetters={clueLetters[index]}
      key={index}
      hintLevel={hintLevel}
    ></Clue>
  ));

  return <div id="clues">{clueDisplays}</div>;
}
