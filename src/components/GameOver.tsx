import React from "react";
import {calculateMixedColor} from "./Clues";
import {palette} from "./palette";
import {Countdown} from "./Countdown";
import {handleShare} from "../common/handleShare";
import type {GameReducerPayload, PrimaryColor} from "../Types";

function resultToIcon({
  hints,
  clueIndexes,
  colors,
}: {
  hints: boolean[][];
  clueIndexes: number[][];
  colors: PrimaryColor[];
}): string {
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

function NewSwatches({
  newPaletteIndexes,
  swatchAnimationDestinationPosition,
}: {
  newPaletteIndexes: number[];
  swatchAnimationDestinationPosition: [number, number] | null;
}): React.JSX.Element {
  const swatchAnimatedRefs = [
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
  ];

  const [swatchAnimationDistance, setSwatchAnimationDistance] = React.useState<
    [number, number][]
  >([]);

  React.useEffect(() => {
    const distances = swatchAnimatedRefs.map((ref) => {
      if (!ref.current || !swatchAnimationDestinationPosition) {
        return [0, 0] as [number, number];
      }
      const swatchAnimatedBox = ref.current.getBoundingClientRect();

      const distanceToMoveX =
        swatchAnimationDestinationPosition[0] -
        (swatchAnimatedBox.left + swatchAnimatedBox.width / 2);

      const distanceToMoveY =
        swatchAnimationDestinationPosition[1] -
        (swatchAnimatedBox.top + swatchAnimatedBox.height / 2);

      return [distanceToMoveX, distanceToMoveY] as [number, number];
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
  dispatchGameState,
  seed,
  isDaily,
}: {
  hints: boolean[][];
  clueIndexes: number[][];
  colors: PrimaryColor[];
  newPaletteIndexes: number[];
  swatchAnimationDestinationPosition: [number, number] | null;
  dispatchGameState: React.Dispatch<GameReducerPayload>;
  seed: string;
  isDaily: boolean;
}): React.JSX.Element {
  const result = resultToIcon({
    hints: hints,
    clueIndexes: clueIndexes,
    colors: colors,
  });

  return (
    <div id="gameOver">
      {isDaily ? (
        <Countdown
          dispatchGameState={dispatchGameState}
          seed={seed}
        ></Countdown>
      ) : (
        <p>Success!</p>
      )}
      <div id="gameOverButtons">
        {navigator.canShare?.() ? (
          <button
            id="shareButton"
            onClick={() => {
              handleShare({
                appName: "Lexlet",
                text: result,
                url: "https://lexlet.com",
                // seed: `${gameState.seed}_${gameState.difficultyLevel}`, // todo add way to share and parse specific puzzle. need to account for daily vs not too. back propogate to blobble
              });
            }}
          ></button>
        ) : (
          <></>
        )}
        {isDaily ? (
          <></>
        ) : (
          <button
            id="newGameButton"
            onClick={() => {
              dispatchGameState({
                action: "newGame",
              });
            }}
          ></button>
        )}
      </div>
      <NewSwatches
        newPaletteIndexes={newPaletteIndexes}
        swatchAnimationDestinationPosition={swatchAnimationDestinationPosition}
      ></NewSwatches>
    </div>
  );
}
