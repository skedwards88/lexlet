import React from "react";
import {calculateMixedColor} from "./Clues";
import {palette} from "./palette";
import {Countdown} from "./Countdown";
import Share from "@skedwards88/shared-components/src/components/Share";
import {useMetadataContext} from "@skedwards88/shared-components/src/components/MetadataContextProvider";
import type {ReducerPayload} from "../logic/gameReducer";
import {type Color} from "../logic/gameInit";

function resultToIcon({
  hints,
  clueIndexes,
  colors,
}: {
  hints: boolean[][];
  clueIndexes: number[][];
  colors: Color[];
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
    React.useRef<HTMLDivElement | null>(null),
    React.useRef<HTMLDivElement | null>(null),
    React.useRef<HTMLDivElement | null>(null),
    React.useRef<HTMLDivElement | null>(null),
    React.useRef<HTMLDivElement | null>(null),
  ];

  const [swatchAnimationDistances, setSwatchAnimationDistances] =
    React.useState<[number, number][]>([]);

  React.useLayoutEffect(() => {
    const distances: [number, number][] = swatchAnimatedRefs.map((ref) => {
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

    // eslint-disable-next-line react-hooks/set-state-in-effect -- https://github.com/facebook/react/issues/34858, https://github.com/react/react/issues/34743
    setSwatchAnimationDistances(distances);
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
              ...(swatchAnimationDistances[index]?.length && {
                "--distanceX": `${swatchAnimationDistances[index][0]}px`,
                "--distanceY": `${swatchAnimationDistances[index][1]}px`,
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
  colors: Color[];
  newPaletteIndexes: number[];
  swatchAnimationDestinationPosition: [number, number] | null;
  dispatchGameState: React.Dispatch<ReducerPayload>;
  seed: string;
  isDaily: boolean;
}): React.JSX.Element {
  const {userId, sessionId} = useMetadataContext();

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
        <Share
          appName="Lexlet"
          text={result}
          url="https://lexlet.com/"
          origin="game over"
          id="shareButton"
          className="controlButton"
          userId={userId}
          sessionId={sessionId}
        ></Share>
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
