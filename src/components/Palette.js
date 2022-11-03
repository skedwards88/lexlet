import React from "react";
import Info from "../common/Info";
import Board from "./Board";
import { gameInit } from "../logic/gameInit";
import { gameReducer } from "../logic/gameReducer";
import Clues from "./Clues";
import CurrentWord from "./CurrentWord";
import GameOver from "./GameOver";

function Palette() {
  const [gameState, dispatchGameState] = React.useReducer(
    gameReducer,
    {},
    gameInit
  );

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
      {gameState.clueMatches.every((i) => i) ? <GameOver hints={gameState.hints} clueIndexes={gameState.clueIndexes} colors={gameState.colors}/> : (
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
      <div id="controls">
        <Info
          info={
            <div>
              {<h1>Palette</h1>}
              {`Build words that match the color patterns by swiping to connect adjacent letters.`}
            </div>
          }
        ></Info>
      </div>
    </div>
  );
}

export default Palette;
