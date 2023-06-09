import React from "react";
import Palette from "./Palette";
import Heart from "./Heart";
import Rules from "./Rules";
import Stats from "./Stats";
import { gameInit } from "../logic/gameInit";
import { gameReducer } from "../logic/gameReducer";

function handleBeforeInstallPrompt(
  event,
  setInstallPromptEvent,
  setShowInstallButton
) {
  console.log("handleBeforeInstallPrompt");
  if (event) setInstallPromptEvent(event);
  setShowInstallButton(true);
}

function handleAppInstalled(setInstallPromptEvent, setShowInstallButton) {
  console.log("handleAppInstalled");
  setInstallPromptEvent(null);
  setShowInstallButton(false);
}

export default function App() {
  const [display, setDisplay] = React.useState("game");
  const [installPromptEvent, setInstallPromptEvent] = React.useState();
  const [showInstallButton, setShowInstallButton] = React.useState(true);
  const [gameState, dispatchGameState] = React.useReducer(
    gameReducer,
    {},
    gameInit
  );

  React.useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) =>
      handleBeforeInstallPrompt(
        event,
        setInstallPromptEvent,
        setShowInstallButton
      )
    );
    return () =>
      window.removeEventListener("beforeinstallprompt", (event) =>
        handleBeforeInstallPrompt(
          event,
          setInstallPromptEvent,
          setShowInstallButton
        )
      );
  }, []);

  React.useEffect(() => {
    window.addEventListener("appinstalled", () =>
      handleAppInstalled(setInstallPromptEvent, setShowInstallButton)
    );
    return () => window.removeEventListener("appinstalled", handleAppInstalled);
  }, []);

  const savedIsFirstGame = JSON.parse(
    localStorage.getItem("dailyPaletteIsFirstGame")
  );

  const [isFirstGame, setIsFirstGame] = React.useState(
    savedIsFirstGame ?? true
  );

  React.useEffect(() => {
    window.localStorage.setItem(
      "dailyPaletteIsFirstGame",
      JSON.stringify(isFirstGame)
    );
  }, [isFirstGame]);

  const savedSawWhatsNew = JSON.parse(
    localStorage.getItem("dailyPaletteSawWhatsNew20230609")
  );

  const [sawWhatsNew, setSawWhatsNew] = React.useState(
    savedSawWhatsNew ?? false
  );

  React.useEffect(() => {
    window.localStorage.setItem(
      "dailyPaletteSawWhatsNew20230609",
      JSON.stringify(sawWhatsNew)
    );
  }, [sawWhatsNew]);

  if (isFirstGame) {
    return (
      <Rules
        setDisplay={setDisplay}
        isFirstGame={isFirstGame}
        setIsFirstGame={setIsFirstGame}
        setSawWhatsNew={setSawWhatsNew}
      ></Rules>
    );
  }

  switch (display) {
    case "rules":
      return <Rules setDisplay={setDisplay}></Rules>;

    case "stats":
      return <Stats setDisplay={setDisplay} stats={gameState.stats}></Stats>;

    case "heart":
      return <Heart setDisplay={setDisplay}></Heart>;

    default:
      return (
        <Palette
          setDisplay={setDisplay}
          setInstallPromptEvent={setInstallPromptEvent}
          showInstallButton={showInstallButton}
          installPromptEvent={installPromptEvent}
          gameState={gameState}
          dispatchGameState={dispatchGameState}
          setSawWhatsNew={setSawWhatsNew}
          sawWhatsNew={sawWhatsNew}
        ></Palette>
      );
  }
}
