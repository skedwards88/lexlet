import React from "react";
import Lexlet from "./Lexlet";
import Heart from "./Heart";
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

export default function App() {
  // *****
  // Install handling setup
  // *****
  // Set up states that will be used by the handleAppInstalled and handleBeforeInstallPrompt listeners
  const [installPromptEvent, setInstallPromptEvent] = React.useState();
  const [showInstallButton, setShowInstallButton] = React.useState(true);

  React.useEffect(() => {
    // Need to store the function in a variable so that
    // the add and remove actions can reference the same function
    const listener = (event) =>
      handleBeforeInstallPrompt(
        event,
        setInstallPromptEvent,
        setShowInstallButton,
      );

    window.addEventListener("beforeinstallprompt", listener);

    return () => window.removeEventListener("beforeinstallprompt", listener);
  }, []);

  React.useEffect(() => {
    // Need to store the function in a variable so that
    // the add and remove actions can reference the same function
    const listener = () =>
      handleAppInstalled(setInstallPromptEvent, setShowInstallButton);

    window.addEventListener("appinstalled", listener);
    return () => window.removeEventListener("appinstalled", listener);
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
    localStorage.getItem("lexletLastVisited"),
  );
  const hasVisitedEver = Boolean(lastVisitedYYYYMMDD);
  const hasVisitedSinceLastAnnouncement = hasVisitedSince(
    lastVisitedYYYYMMDD,
    "20230609",
  );

  // Record that they visited today
  const [lastVisited] = React.useState(getDailySeed());
  React.useEffect(() => {
    window.localStorage.setItem(
      "lexletLastVisited",
      JSON.stringify(lastVisited),
    );
  }, [lastVisited]);

  // Determine what view to show the user
  const savedDisplay = JSON.parse(localStorage.getItem("lexletDisplay"));
  const [display, setDisplay] = React.useState(
    getInitialState(
      savedDisplay,
      hasVisitedEver,
      hasVisitedSinceLastAnnouncement,
    ),
  );

  // ******
  // End set up the display state
  // ******

  const [gameState, dispatchGameState] = React.useReducer(
    gameReducer,
    {},
    gameInit,
  );

  switch (display) {
    case "announcement":
      return <WhatsNew setDisplay={setDisplay}></WhatsNew>;

    case "rules":
      return <Rules setDisplay={setDisplay}></Rules>;

    case "stats":
      return <Stats setDisplay={setDisplay} stats={gameState.stats}></Stats>;

    case "heart":
      return <Heart setDisplay={setDisplay}></Heart>;

    default:
      return (
        <Lexlet
          setDisplay={setDisplay}
          setInstallPromptEvent={setInstallPromptEvent}
          showInstallButton={showInstallButton}
          installPromptEvent={installPromptEvent}
          gameState={gameState}
          dispatchGameState={dispatchGameState}
        ></Lexlet>
      );
  }
}
