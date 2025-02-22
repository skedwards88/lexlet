import React from "react";
import Board from "./Board";
import Clues, {calculateMixedColor} from "./Clues";
import CurrentWord from "./CurrentWord";
import GameOver from "./GameOver";
import {Countdown} from "./Countdown";
import {palette} from "./palette";
import {handleInstall} from "../common/handleInstall";
import {getNewPaletteIndexes} from "../logic/getNewPaletteIndexes";

export default function Lexlet({
  setDisplay,
  installPromptEvent,
  showInstallButton,
  setInstallPromptEvent,
  gameState,
  dispatchGameState,
  stats,
  updateStats,
}) {
  React.useEffect(() => {
    window.localStorage.setItem("dailyLexletState", JSON.stringify(gameState));
  }, [gameState]);

  const swatchAnimationDestinationRef = React.useRef(null);
  const [
    swatchAnimationDestinationPosition,
    setSwatchAnimationDestinationPosition,
  ] = React.useState([]);
  const [flashColors, setFlashColors] = React.useState([]);

  const [newPaletteIndexes, setNewPaletteIndexes] = React.useState([]);

  const isGameOver = gameState.clueMatches.every((i) => i);

  React.useEffect(() => {
    console.log(`In setNewPaletteIndexes hook`);
    if (!isGameOver) {
      return;
    }

    console.log(`actually executing setNewPaletteIndexes hook`);
    setNewPaletteIndexes(
      getNewPaletteIndexes({
        previouslyCollectedIndexes: stats.collectedSwatchIndexes,
        clueIndexes: gameState.clueIndexes,
        boardColors: gameState.colors,
      }),
    );
  }, [
    isGameOver,
    gameState.clueIndexes,
    gameState.colors,
    stats.collectedSwatchIndexes,
  ]);

  React.useEffect(() => {
    console.log(`in update stats hook`);
    if (!newPaletteIndexes.length) {
      return;
    }

    console.log(`actually executing update stats hook`);
    updateStats((previousStats) => ({
      ...previousStats,
      collectedSwatchIndexes: [
        ...previousStats.collectedSwatchIndexes,
        ...newPaletteIndexes,
      ],
    }));

    const flashColors = newPaletteIndexes.map((swatchIndex) =>
      calculateMixedColor(palette[swatchIndex]),
    );

    setFlashColors(flashColors);
  }, [newPaletteIndexes, updateStats]);

  React.useEffect(() => {
    if (!isGameOver) {
      return;
    }

    if (swatchAnimationDestinationRef.current) {
      const swatchAnimationDestinationBox =
        swatchAnimationDestinationRef.current.getBoundingClientRect();

      const swatchAnimationDestinationPositionX =
        swatchAnimationDestinationBox.left +
        swatchAnimationDestinationBox.width / 2;

      const swatchAnimationDestinationPositionY =
        swatchAnimationDestinationBox.top +
        swatchAnimationDestinationBox.height / 2;

      setSwatchAnimationDestinationPosition([
        swatchAnimationDestinationPositionX,
        swatchAnimationDestinationPositionY,
      ]);
    }
  }, [isGameOver]);

  return (
    <div
      className="App"
      id="lexlet"
      onPointerUp={(e) => {
        e.preventDefault();

        dispatchGameState({
          action: "endWord",
        });
      }}
    >
      <div id="controls">
        <div id="nextGame">
          {isGameOver ? (
            <Countdown
              dispatchGameState={dispatchGameState}
              seed={gameState.seed}
            ></Countdown>
          ) : (
            `Hints used: ${
              gameState.hints.flatMap((i) => i).filter((i) => i).length
            }`
          )}
        </div>
        <button id="rules" onClick={() => setDisplay("rules")}></button>
        <button
          id="stats"
          ref={swatchAnimationDestinationRef}
          style={{
            "--colorA": `${flashColors[0] || "transparent"}`,
            "--colorB": `${flashColors[1] || "transparent"}`,
            "--colorC": `${flashColors[2] || "transparent"}`,
            "--colorD": `${flashColors[3] || "transparent"}`,
            "--colorE": `${flashColors[4] || "transparent"}`,
          }}
          onClick={() => {
            setDisplay("stats");
          }}
          className={flashColors.length ? "swatchFlash" : ""}
        ></button>
        <button id="heart" onClick={() => setDisplay("heart")}></button>
        {showInstallButton && installPromptEvent ? (
          <button
            id="install"
            onClick={() =>
              handleInstall(installPromptEvent, setInstallPromptEvent)
            }
          ></button>
        ) : (
          <></>
        )}
      </div>
      <Clues
        clueMatches={gameState.clueMatches}
        hints={gameState.hints}
        clueColors={gameState.clueIndexes.map((clue) =>
          clue.map((index) => gameState.colors[index]),
        )}
        clueLetters={gameState.clueIndexes.map((clue) =>
          clue.map((index) => gameState.letters[index]),
        )}
        dispatchGameState={dispatchGameState}
      ></Clues>
      <CurrentWord
        letters={gameState.playedIndexes.map(
          (index) => gameState.letters[index],
        )}
        colors={gameState.playedIndexes.map((index) => gameState.colors[index])}
      ></CurrentWord>
      {gameState.result ? (
        <div id="wordResult" className="fadeOut">
          {gameState.result}
        </div>
      ) : (
        <></>
      )}
      {isGameOver ? (
        <GameOver
          hints={gameState.hints}
          clueIndexes={gameState.clueIndexes}
          colors={gameState.colors}
          newPaletteIndexes={newPaletteIndexes}
          swatchAnimationDestinationPosition={
            swatchAnimationDestinationPosition
          }
        />
      ) : (
        <Board
          letters={gameState.letters}
          colors={gameState.colors}
          playedIndexes={gameState.playedIndexes}
          gameOver={gameState.clueMatches.every((i) => i)}
          dispatchGameState={dispatchGameState}
        ></Board>
      )}
    </div>
  );
}
