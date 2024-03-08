import React from "react";

function convertToRGB(red, yellow, blue) {
  // Convert RYB to RGB
  // I pulled these calculations from the internet and made some tweaks until it looked "right-ish"

  // Subtract the "whiteness"
  const whiteness = Math.min(red, yellow, blue);
  red -= whiteness;
  yellow -= whiteness;
  blue -= whiteness;

  // Get the "green" from the yellow and blue
  let green = Math.min(yellow, blue);
  yellow -= green;
  blue -= green;

  // Do more adjusting
  if (blue && green) {
    blue *= 2.0;
    green *= 2.0;
  }

  // Redistribute the remaining yellow
  red += yellow;
  green += yellow;

  // Add the "whiteness" back
  red += whiteness;
  green += whiteness;
  blue += whiteness;

  // Normalize to 255 max if needed
  const maxValue = Math.max(red, green, blue);
  if (maxValue > 255) {
    red = Math.round((red / maxValue) * 255);
    green = Math.round((green / maxValue) * 255);
    blue = Math.round((blue / maxValue) * 255);
  }

  return [red, green, blue];
}

function calculateMixedColor(colors) {
  // Convert a list of red/yellow/blue color names
  // to an rbga value reflecting the mixture of the colors

  const rybLookup = {
    red: [169, 6, 67],
    yellow: [45, 189, 10],
    blue: [36, 66, 199],
  };

  let redSum = 0;
  let yellowSum = 0;
  let blueSum = 0;

  for (const color of colors) {
    const [red, yellow, blue] = rybLookup[color];
    redSum += red;
    yellowSum += yellow;
    blueSum += blue;
  }

  const redAverage = redSum / colors.length;
  const yellowAverage = yellowSum / colors.length;
  const blueAverage = blueSum / colors.length;

  const [convertedRed, convertedYellow, convertedBlue] = convertToRGB(
    redAverage,
    yellowAverage,
    blueAverage,
  );

  return `rgba(${convertedRed}, ${convertedYellow}, ${convertedBlue}, 0.8)`;
}

function Clue({
  clueColors,
  clueMatch,
  clueLetters,
  hint,
  dispatchGameState,
  clueIndex,
}) {
  const clueSolved = clueMatch || hint.every((i) => i);
  const boxes = clueColors.map((color, index) => (
    <button
      className={`clueBox ${color}`}
      key={`${index}`}
      style={
        clueSolved
          ? {backgroundColor: `${calculateMixedColor(clueColors)}`}
          : {}
      }
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
