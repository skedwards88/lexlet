import React from "react";
import Board from "./Board";
import Clues from "./Clues";
import CurrentWord from "./CurrentWord";
import GameOver from "./GameOver";
import {Countdown} from "./Countdown";
import WhatsNew from "./WhatsNew";

async function handleInstall(installPromptEvent, setInstallPromptEvent) {
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
          onClick={() => {
            dispatchGameState({action: "clearStreakIfNeeded"});
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
      {isGameOver ? (
        <GameOver
          hints={gameState.hints}
          clueIndexes={gameState.clueIndexes}
          colors={gameState.colors}
        />
      ) : (
        <CurrentWord
          letters={gameState.playedIndexes.map(
            (index) => gameState.letters[index],
          )}
          colors={gameState.playedIndexes.map(
            (index) => gameState.colors[index],
          )}
        ></CurrentWord>
      )}
      {gameState.result ? (
        <div id="wordResult" className="fadeOut">
          {gameState.result}
        </div>
      ) : (
        <></>
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
