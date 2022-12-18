import React from "react";
import Palette from "./Palette";
import Heart from "./Heart";
import Rules from "./Rules";

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

  const savedState = JSON.parse(
    localStorage.getItem("dailyPaletteIsFirstGame")
  );

  const [isFirstGame, setIsFirstGame] = React.useState(savedState ?? true);

  React.useEffect(() => {
    window.localStorage.setItem(
      "dailyPaletteIsFirstGame",
      JSON.stringify(isFirstGame)
    );
  }, [isFirstGame]);

  if (isFirstGame) {
    return (
      <Rules
        setDisplay={setDisplay}
        isFirstGame={isFirstGame}
        setIsFirstGame={setIsFirstGame}
      ></Rules>
    );
  }

  switch (display) {
    case "game":
      return <Palette setDisplay={setDisplay}></Palette>;

    case "rules":
      return <Rules setDisplay={setDisplay}></Rules>;

    case "heart":
      return <Heart setDisplay={setDisplay}></Heart>;

    default:
      return (
        <Palette
          setDisplay={setDisplay}
          setInstallPromptEvent={setInstallPromptEvent}
          showInstallButton={showInstallButton}
          installPromptEvent={installPromptEvent}
        ></Palette>
      );
  }
}
