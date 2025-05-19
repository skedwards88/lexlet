import React from "react";
import type {GameReducerPayload, Letter, PrimaryColor} from "../Types";

function Letter({
  letter,
  color,
  letterAvailability,
  index,
  dispatchGameState,
  collectedSwatchIndexes,
}: {
  letter: Letter;
  color: PrimaryColor;
  letterAvailability: boolean;
  index: number;
  dispatchGameState: React.Dispatch<GameReducerPayload>;
  collectedSwatchIndexes: number[];
}): React.JSX.Element {
  const letterRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const letterDiv = letterRef.current;
    if (!letterDiv) {
      return;
    }

    const currentClasses = letterDiv.className
      .split(" ")
      .filter((entry) => entry !== "unavailable");

    const newClass = letterAvailability
      ? currentClasses.join(" ")
      : [...currentClasses, "unavailable"].join(" ");

    letterDiv.className = newClass;
  }, [letterAvailability]);

  function handlePointerDown(event: React.PointerEvent, index: number): void {
    event.preventDefault();
    event.currentTarget.releasePointerCapture(event.pointerId);
    dispatchGameState({
      action: "startWord",
      letterIndex: index,
    });
  }

  function handlePointerEnter(
    event: React.PointerEvent,
    index: number,
    letterAvailability: boolean,
  ): void {
    event.preventDefault();
    if (!letterAvailability) {
      dispatchGameState({
        action: "removeLetter",
        letterIndex: index,
      });
    } else {
      // Add the letter to the list of letters
      dispatchGameState({
        action: "addLetter",
        letterIndex: index,
      });
    }
  }

  function handlePointerUp(event: React.PointerEvent): void {
    event.preventDefault();

    dispatchGameState({
      action: "endWord",
      collectedSwatchIndexes,
    });
  }

  return (
    <div
      className={`letter ${color}`}
      ref={letterRef}
      onPointerDown={(e) => handlePointerDown(e, index)}
      onPointerEnter={(e) => handlePointerEnter(e, index, letterAvailability)}
      onPointerUp={(e) => handlePointerUp(e)}
      draggable={false}
    >
      {letter}
    </div>
  );
}

export default function Board({
  letters,
  colors,
  playedIndexes,
  gameOver,
  dispatchGameState,
  collectedSwatchIndexes,
}: {
  letters: Letter[];
  colors: PrimaryColor[];
  playedIndexes: number[];
  gameOver: boolean;
  dispatchGameState: React.Dispatch<GameReducerPayload>;
  collectedSwatchIndexes: number[];
}): React.JSX.Element {
  const board = letters.map((letter, index) => (
    <Letter
      letter={letter}
      color={colors[index]}
      letterAvailability={gameOver ? false : !playedIndexes.includes(index)}
      index={index}
      dispatchGameState={dispatchGameState}
      key={`${index}${letter}${colors[index]}`}
      collectedSwatchIndexes={collectedSwatchIndexes}
    ></Letter>
  ));

  const numColumns = Math.sqrt(letters.length);

  return (
    <div id="board" className={`rows${numColumns}`}>
      {board}{" "}
    </div>
  );
}
