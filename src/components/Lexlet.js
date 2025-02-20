import React from "react";
import Board from "./Board";
import Clues, {calculateMixedColor} from "./Clues";
import CurrentWord from "./CurrentWord";
import GameOver from "./GameOver";
import {Countdown} from "./Countdown";
import WhatsNew from "./WhatsNew";
import {palette} from "./palette";
import {handleInstall} from "../common/handleInstall";

export default function Lexlet({
  setDisplay,
  installPromptEvent,
  showInstallButton,
  setInstallPromptEvent,
  setSawWhatsNew,
  sawWhatsNew,
  gameState,
  dispatchGameState,
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

  React.useEffect(() => {
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

      if (gameState.newSwatchIndexes.length) {
        const flashColors = gameState.newSwatchIndexes.map((swatchIndex) =>
          calculateMixedColor(palette[swatchIndex]),
        );

        setFlashColors(flashColors);

        swatchAnimationDestinationRef.current.classList.add("swatchFlash");
      }
    }
  }, [gameState.newSwatchIndexes]);

  const isGameOver = gameState.clueMatches.every((i) => i);

  if (!sawWhatsNew) {
    return (
      <WhatsNew
        setDisplay={setDisplay}
        setSawWhatsNew={setSawWhatsNew}
      ></WhatsNew>
    );
  }

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
          newSwatchIndexes={gameState.newSwatchIndexes}
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
