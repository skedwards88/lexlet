import React from "react";
import Board from "./Board";
import { gameInit } from "../logic/gameInit";
import { gameReducer } from "../logic/gameReducer";
import Clues from "./Clues";
import CurrentWord from "./CurrentWord";
import GameOver from "./GameOver";
import { Countdown } from "./Countdown";

export default function Palette({ setDisplay }) {
  const [gameState, dispatchGameState] = React.useReducer(
    gameReducer,
    {},
    gameInit
  );

  React.useEffect(() => {
    window.localStorage.setItem("dailyPaletteState", JSON.stringify(gameState));
  }, [gameState]);

  const isGameOver = gameState.clueMatches.every((i) => i);

  const [installPromptEvent, setInstallPromptEvent] = React.useState();
  const [showInstallButton, setShowInstallButton] = React.useState(true);

  function handleBeforeInstallPrompt(event) {
    console.log("handleBeforeInstallPrompt");
    if (event) setInstallPromptEvent(event);
    setShowInstallButton(true);
  }

  function handleAppInstalled() {
    console.log("handleAppInstalled");
    setInstallPromptEvent(null);
    setShowInstallButton(false);
  }

  React.useEffect(() => {
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
  }); // todo not sure if this is the correct dep array

  React.useEffect(() => {
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => window.removeEventListener("appinstalled", handleAppInstalled);
  }, []); // todo not sure if this is the correct dep array

  async function handleInstall() {
    console.log("handling install");
    console.log(installPromptEvent);
    installPromptEvent.prompt();
    const result = await installPromptEvent.userChoice;
    console.log(result);
    setInstallPromptEvent(null);

    try {
      window.gtag("event", "install", {});
    } catch (error) {
      console.log("tracking error", error);
    }
  }

  return (
    <div
      className="App"
      id="palette"
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
            <Countdown></Countdown>
          ) : (
            `Hints used: ${
              gameState.hints.flatMap((i) => i).filter((i) => i).length
            }`
          )}
        </div>
        <button id="rules" onClick={() => setDisplay("rules")}></button>
        <button id="heart" onClick={() => setDisplay("heart")}></button>
        {showInstallButton && installPromptEvent ? (
          <button id="install" onClick={() => handleInstall()}></button>
        ) : (
          <></>
        )}
      </div>
      <Clues
        clueMatches={gameState.clueMatches}
        hints={gameState.hints}
        clueColors={gameState.clueIndexes.map((clue) =>
          clue.map((index) => gameState.colors[index])
        )}
        clueLetters={gameState.clueIndexes.map((clue) =>
          clue.map((index) => gameState.letters[index])
        )}
        dispatchGameState={dispatchGameState}
      ></Clues>
      {isGameOver ? (
        <GameOver
          hints={gameState.hints}
          clueIndexes={gameState.clueIndexes}
          colors={gameState.colors}
        />
      ) : (
        <CurrentWord
          letters={gameState.playedIndexes.map(
            (index) => gameState.letters[index]
          )}
          colors={gameState.playedIndexes.map(
            (index) => gameState.colors[index]
          )}
        ></CurrentWord>
      )}
      <Board
        letters={gameState.letters}
        colors={gameState.colors}
        playedIndexes={gameState.playedIndexes}
        gameOver={gameState.clueMatches.every((i) => i)}
        dispatchGameState={dispatchGameState}
      ></Board>
    </div>
  );
}
