import React from "react";
import packageJson from "../../package.json";

export default function Rules({
  setDisplay,
  isFirstGame,
  setIsFirstGame,
  setSawWhatsNew,
}) {
  return (
    <div className="App rules">
      <h1 id="rulesHeader">Lexlet: How to play</h1>
      <p id="rulesText">{`Swipe to join connecting letters into words that match the color patterns.\n\nTap on a pattern to get a hint.\n\n The game is easier on Monday and gets harder over the week. Can you win every day?`}</p>
      <div id="rulesDemo"></div>
      <button
        id="rulesClose"
        className="close"
        onClick={() => {
          if (isFirstGame) {
            setIsFirstGame(false);
            setSawWhatsNew(true);
          }
          setDisplay("game");
        }}
      >
        {isFirstGame ? "Start game" : "Close"}
      </button>
      <small id="rulesVersion">version {packageJson.version}</small>
    </div>
  );
}
