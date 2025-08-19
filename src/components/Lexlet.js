import React from "react";
import Board from "./Board";
import Clues from "./Clues";
import CurrentWord from "./CurrentWord";
import GameOver from "./GameOver";
import ControlBar from "./ControlBar";

export default function Lexlet({
  setDisplay,
  gameState, //todo don't pass full state
  dispatchGameState,
  stats,
  setStats,
  isDaily,
  dailyIsSolved,
}) {
  const swatchAnimationDestinationRef = React.useRef(null);
  const [
    swatchAnimationDestinationPosition,
    setSwatchAnimationDestinationPosition,
  ] = React.useState([]);

  const isGameOver = gameState.clueMatches.every((i) => i);

  React.useEffect(() => {
    if (gameState.newPaletteIndexes.length) {
      setStats((previousStats) => ({
        ...previousStats,
        collectedSwatchIndexes: Array.from(
          new Set([
            ...previousStats.collectedSwatchIndexes,
            ...gameState.newPaletteIndexes,
          ]),
        ),
      }));
    }
  }, [gameState.newPaletteIndexes]);

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
          collectedSwatchIndexes: stats.collectedSwatchIndexes,
        });
      }}
    >
      <ControlBar
        swatchAnimationDestinationRef={swatchAnimationDestinationRef}
        newPaletteIndexes={gameState.newPaletteIndexes}
        setDisplay={setDisplay}
        isDaily={isDaily}
        dailyIsSolved={dailyIsSolved}
        dispatchGameState={dispatchGameState}
        gameState={gameState}
      ></ControlBar>
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
          newPaletteIndexes={gameState.newPaletteIndexes}
          swatchAnimationDestinationPosition={
            swatchAnimationDestinationPosition
          }
          dispatchGameState={dispatchGameState}
          seed={gameState.seed}
          isDaily={isDaily}
          gameState={gameState}
        />
      ) : (
        <Board
          letters={gameState.letters}
          colors={gameState.colors}
          playedIndexes={gameState.playedIndexes}
          gameOver={gameState.clueMatches.every((i) => i)}
          dispatchGameState={dispatchGameState}
          collectedSwatchIndexes={stats.collectedSwatchIndexes}
        ></Board>
      )}
    </div>
  );
}
