import React from "react";

function Letter({
  letter,
  color,
  letterAvailability,
  index,
  dispatchGameState,
  collectedSwatchIndexes,
}) {
  const myRef = React.useRef();

  React.useLayoutEffect(() => {
    const myDiv = myRef.current;
    const currentClasses = myDiv.className
      .split(" ")
      .filter((entry) => entry !== "unavailable");

    const newClass = letterAvailability
      ? currentClasses.join(" ")
      : [...currentClasses, "unavailable"].join(" ");

    myDiv.className = newClass;
  }, [letterAvailability]);

  function handlePointerDown(e, index) {
    e.preventDefault();
    e.target.releasePointerCapture(e.pointerId);
    dispatchGameState({
      action: "startWord",
      letterIndex: index,
    });
  }

  function handlePointerEnter(e, index, letterAvailability) {
    e.preventDefault();
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

  function handlePointerUp(e) {
    e.preventDefault();

    dispatchGameState({
      action: "endWord",
      collectedSwatchIndexes,
    });
  }

  return (
    <div
      className={`letter ${color}`}
      ref={myRef}
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
}) {
  const board = letters.map((letter, index) => (
    <Letter
      letter={letter}
      color={colors[index]}
      letterAvailability={gameOver ? false : !playedIndexes.includes(index)}
      index={index}
      draggable={false}
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
