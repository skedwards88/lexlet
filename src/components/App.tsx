import React from "react";
import Lexlet from "./Lexlet";
import MoreGames from "./MoreGames";
import Rules from "./Rules";
import Stats from "./Stats";
import WhatsNew from "./WhatsNew";
import {gameInit} from "../logic/gameInit";
import {gameReducer} from "../logic/gameReducer";
import {
  handleAppInstalled,
  handleBeforeInstallPrompt,
} from "../common/handleInstall";
import {hasVisitedSince} from "../common/hasVisitedSince";
import getDailySeed from "../common/getDailySeed";
import {getInitialState} from "../common/getInitialState";
import {statsInit} from "../logic/statsInit";
import Settings from "./Settings";
import type {BeforeInstallPromptEvent, DisplayState} from "../Types";

export default function App(): React.JSX.Element {
  // *****
  // Install handling setup
  // *****
  // Set up states that will be used by the handleAppInstalled and handleBeforeInstallPrompt listeners
  const [installPromptEvent, setInstallPromptEvent] =
    React.useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = React.useState(true);

  React.useEffect(() => {
    // Need to store the function in a variable so that
    // the add and remove actions can reference the same function
    const listener = (event: Event): void =>
      handleBeforeInstallPrompt(
        event as BeforeInstallPromptEvent,
        setInstallPromptEvent,
        setShowInstallButton,
      );

    window.addEventListener("beforeinstallprompt", listener);

    return (): void =>
      window.removeEventListener("beforeinstallprompt", listener);
  }, []);

  React.useEffect(() => {
    // Need to store the function in a variable so that
    // the add and remove actions can reference the same function
    const listener = (): void =>
      handleAppInstalled(setInstallPromptEvent, setShowInstallButton);

    window.addEventListener("appinstalled", listener);
    return (): void => window.removeEventListener("appinstalled", listener);
  }, []);
  // *****
  // End install handling setup
  // *****

  // ******
  // Set up the display state
  // ******
  // Determine when the player last visited the game
  // This is used to determine whether to show the rules or an announcement instead of the game
  const lastVisitedYYYYMMDD = JSON.parse(
    localStorage.getItem("lexletLastVisited") ?? "null",
  );
  const hasVisitedEver = Boolean(lastVisitedYYYYMMDD);
  const hasVisitedSinceLastAnnouncement = hasVisitedSince(
    lastVisitedYYYYMMDD,
    "20230609",
  );

  // Record that they visited today
  const [lastVisited, setLastVisited] = React.useState(getDailySeed());
  React.useEffect(() => {
    window.localStorage.setItem(
      "lexletLastVisited",
      JSON.stringify(lastVisited),
    );
  }, [lastVisited]);

  function handleVisibilityChange(): void {
    // If the visibility of the app changes to become visible,
    // update the state to force the app to re-render.
    // This is to help the daily challenge refresh if the app has
    // been open in the background since an earlier challenge.
    if (!document.hidden) {
      setLastVisited(getDailySeed());
    }
  }

  React.useEffect(() => {
    // When the component is mounted, attach the visibility change event listener
    // (and remove the event listener when the component is unmounted).
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return (): void => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Determine what view to show the user
  const savedDisplay = JSON.parse(
    localStorage.getItem("lexletDisplay") ?? "null",
  );
  const [display, setDisplay] = React.useState(
    getInitialState(
      savedDisplay,
      hasVisitedEver,
      hasVisitedSinceLastAnnouncement,
    ),
  );

  React.useEffect(() => {
    window.localStorage.setItem("lexletDisplay", JSON.stringify(display));
  }, [display]);
  // ******
  // End set up the display state
  // ******

  // ******
  // Game states setup
  // ******
  const [dailyGameState, dispatchDailyGameState] = React.useReducer(
    gameReducer,
    {isDaily: true},
    gameInit,
  );

  const [gameState, dispatchGameState] = React.useReducer(
    gameReducer,
    {},
    gameInit,
  );

  React.useEffect(() => {
    window.localStorage.setItem(
      "lexletGameSavedState",
      JSON.stringify(gameState),
    );
  }, [gameState]);

  React.useEffect(() => {
    window.localStorage.setItem(
      "lexletDailySavedState",
      JSON.stringify(dailyGameState),
    );
  }, [dailyGameState]);

  // ******
  // End game states setup
  // ******

  // ******
  // Stats setup
  // ******
  const [stats, setStats] = React.useState(statsInit());

  React.useEffect(() => {
    window.localStorage.setItem("lexletStats", JSON.stringify(stats));
  }, [stats]);
  // ******
  // End stats setup
  // ******

  switch (display as DisplayState) {
    case "announcement":
      return <WhatsNew setDisplay={setDisplay}></WhatsNew>;

    case "rules":
      return <Rules setDisplay={setDisplay}></Rules>;

    case "stats":
      return <Stats setDisplay={setDisplay} stats={stats}></Stats>;

    case "heart":
      return <MoreGames setDisplay={setDisplay}></MoreGames>;

    case "settings":
      return (
        <Settings
          setDisplay={setDisplay}
          dispatchGameState={dispatchGameState}
          currentDifficulty={gameState.difficultyLevel}
        />
      );

    case "daily":
      // force reinitialize the daily state if the day has changed
      if (dailyGameState.seed != getDailySeed()) {
        dispatchDailyGameState({
          action: "newGame",
          isDaily: true,
        });
      }
      return (
        <Lexlet
          setDisplay={setDisplay}
          setInstallPromptEvent={setInstallPromptEvent}
          showInstallButton={showInstallButton}
          installPromptEvent={installPromptEvent}
          clueMatches={dailyGameState.clueMatches}
          newPaletteIndexes={dailyGameState.newPaletteIndexes}
          hints={dailyGameState.hints}
          clueIndexes={dailyGameState.clueIndexes}
          dispatchGameState={dispatchDailyGameState}
          stats={stats}
          setStats={setStats}
          isDaily={true}
          dailyIsSolved={dailyGameState.clueMatches.every((i) => i)}
          colors={dailyGameState.colors}
          letters={dailyGameState.letters}
          playedIndexes={dailyGameState.playedIndexes}
          result={dailyGameState.result}
          seed={dailyGameState.seed}
        ></Lexlet>
      );

    default:
      return (
        <Lexlet
          setDisplay={setDisplay}
          setInstallPromptEvent={setInstallPromptEvent}
          showInstallButton={showInstallButton}
          installPromptEvent={installPromptEvent}
          clueMatches={gameState.clueMatches}
          newPaletteIndexes={gameState.newPaletteIndexes}
          hints={gameState.hints}
          clueIndexes={gameState.clueIndexes}
          dispatchGameState={dispatchGameState}
          stats={stats}
          setStats={setStats}
          isDaily={false}
          dailyIsSolved={dailyGameState.clueMatches.every((i) => i)}
          colors={gameState.colors}
          letters={gameState.letters}
          playedIndexes={gameState.playedIndexes}
          result={gameState.result}
          seed={gameState.seed}
        ></Lexlet>
      );
  }
}
