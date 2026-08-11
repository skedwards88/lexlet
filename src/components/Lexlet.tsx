import React from "react";
import Board from "./Board";
import Clues from "./Clues";
import CurrentWord from "./CurrentWord";
import GameOver from "./GameOver";
import ControlBar from "./ControlBar";
import type {ReducerPayload} from "../logic/gameReducer";
import type {DisplayState} from "./App";
import type {GameState} from "../logic/gameInit";
import type {Stats} from "../logic/statsInit";

export default function Lexlet({
  setDisplay,
  gameState,
  dispatchGameState,
  stats,
  setStats,
  isDaily,
  dailyIsSolved,
}: {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
  gameState: GameState;
  dispatchGameState: React.Dispatch<ReducerPayload>;
  stats: Stats;
  setStats: React.Dispatch<React.SetStateAction<Stats>>;
  isDaily: boolean;
  dailyIsSolved: boolean;
}): React.JSX.Element {
  const swatchAnimationDestinationRef = React.useRef<HTMLButtonElement | null>(
    null,
  );
  const [
    swatchAnimationDestinationPosition,
    setSwatchAnimationDestinationPosition,
  ] = React.useState<[number, number] | null>(null);

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
  }, [gameState.newPaletteIndexes, setStats]);

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
        collectedSwatchIndexes={stats.collectedSwatchIndexes}
      ></Clues>
      <CurrentWord
        letters={gameState.playedIndexes.map(
          (index) => gameState.letters[index],
        )}
        colors={gameState.playedIndexes.map((index) => gameState.colors[index])}
      ></CurrentWord>
      {gameState.lastInvalidWord ? (
        <div id="wordResult" className="fadeOut">
          Unknown word
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
