import React from "react";
import Info from "../common/Info";
import Board from "./Board";
import { gameInit } from "../logic/gameInit";
import { gameReducer } from "../logic/gameReducer";
import Clues from "./Clues";
import CurrentWord from "./CurrentWord";
import GameOver from "./GameOver";
import Share from "./Share";

function Palette() {
  const [gameState, dispatchGameState] = React.useReducer(
    gameReducer,
    {},
    gameInit
  );

  const isGameOver = gameState.clueMatches.every((i) => i);

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
        <div id="nextGame">{isGameOver ? "Next game at 03:00" : ""}</div>
        <Info
          id="rules"
          info={
            <div>
              {<h1>Palette</h1>}
              {`Build words that match the color patterns by swiping to connect adjacent letters.\n\nClick on a clue to get a hint.`}
            </div>
          }
        ></Info>
        <Info
          id="heart"
          info={
            <div>
              {"Like this game? Share it with your friends.\n\n"}
              {<Share text={"Check out this word game!"}></Share>}
              {`\n\n`}
              {<hr></hr>}
              {`\n`}
              {"Feedback? "}
              <a href="https://github.com/skedwards88/palette/issues/new">
                Open an issue
              </a>
              {" on GitHub."}
              {`\n\n`}
              {<hr></hr>}
              {`\n`}
              {`Thanks to `}
              <a href="https://github.com/wordnik/wordlist">Wordnik</a>
              {` for their open source word list and `}
              <a href="https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists#English">
                Wiktionary
              </a>
              {` and data therein for word frequency data.`}
            </div>
          }
        ></Info>
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

export default Palette;
