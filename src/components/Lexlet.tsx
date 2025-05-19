import React from "react";
import Board from "./Board";
import Clues from "./Clues";
import CurrentWord from "./CurrentWord";
import GameOver from "./GameOver";
import ControlBar from "./ControlBar";
import type {
  BeforeInstallPromptEvent,
  DisplayState,
  GameReducerPayload,
  Letter,
  PrimaryColor,
  Stats,
} from "../Types";

export default function Lexlet({
  setDisplay,
  setInstallPromptEvent,
  showInstallButton,
  installPromptEvent,
  clueMatches,
  newPaletteIndexes,
  hints,
  clueIndexes,
  dispatchGameState,
  stats,
  setStats,
  isDaily,
  dailyIsSolved,
  colors,
  letters,
  playedIndexes,
  result,
  seed,
}: {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
  setInstallPromptEvent: React.Dispatch<
    React.SetStateAction<BeforeInstallPromptEvent | null>
  >;
  showInstallButton: boolean;
  installPromptEvent: BeforeInstallPromptEvent | null;
  clueMatches: boolean[];
  newPaletteIndexes: number[];
  hints: boolean[][];
  clueIndexes: number[][];
  dispatchGameState: React.Dispatch<GameReducerPayload>;
  stats: Stats;
  setStats: React.Dispatch<React.SetStateAction<Stats>>;
  isDaily: boolean;
  dailyIsSolved: boolean;
  colors: PrimaryColor[];
  letters: Letter[];
  playedIndexes: number[];
  result: string;
  seed: string;
}): React.JSX.Element {
  const swatchAnimationDestinationRef = React.useRef<HTMLButtonElement>(null);
  const [
    swatchAnimationDestinationPosition,
    setSwatchAnimationDestinationPosition,
  ] = React.useState<[number, number] | null>(null);

  const isGameOver = clueMatches.every((i) => i);

  React.useEffect(() => {
    if (newPaletteIndexes.length) {
      setStats((previousStats) => ({
        ...previousStats,
        collectedSwatchIndexes: Array.from(
          new Set([
            ...previousStats.collectedSwatchIndexes,
            ...newPaletteIndexes,
          ]),
        ),
      }));
    }
  }, [newPaletteIndexes]);

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
        newPaletteIndexes={newPaletteIndexes}
        setDisplay={setDisplay}
        installPromptEvent={installPromptEvent}
        showInstallButton={showInstallButton}
        setInstallPromptEvent={setInstallPromptEvent}
        isDaily={isDaily}
        dailyIsSolved={dailyIsSolved}
        dispatchGameState={dispatchGameState}
      ></ControlBar>
      <Clues
        clueMatches={clueMatches}
        hints={hints}
        clueColors={clueIndexes.map((clue) =>
          clue.map((index) => colors[index]),
        )}
        clueLetters={clueIndexes.map((clue) =>
          clue.map((index) => letters[index]),
        )}
        dispatchGameState={dispatchGameState}
      ></Clues>
      <CurrentWord
        letters={playedIndexes.map((index) => letters[index])}
        colors={playedIndexes.map((index) => colors[index])}
      ></CurrentWord>
      {result ? (
        <div id="wordResult" className="fadeOut">
          {result}
        </div>
      ) : (
        <></>
      )}
      {isGameOver ? (
        <GameOver
          hints={hints}
          clueIndexes={clueIndexes}
          colors={colors}
          newPaletteIndexes={newPaletteIndexes}
          swatchAnimationDestinationPosition={
            swatchAnimationDestinationPosition
          }
          dispatchGameState={dispatchGameState}
          seed={seed}
          isDaily={isDaily}
        />
      ) : (
        <Board
          letters={letters}
          colors={colors}
          playedIndexes={playedIndexes}
          gameOver={clueMatches.every((i) => i)}
          dispatchGameState={dispatchGameState}
          collectedSwatchIndexes={stats.collectedSwatchIndexes}
        ></Board>
      )}
    </div>
  );
}
