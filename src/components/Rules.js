import React from "react";
import packageJson from "../../package.json";

export default function Rules({ setDisplay }) {
  return (
    <div className="App rules">
      <h1 id="rulesHeader">Palette</h1>
      <p id="rulesText">{`Swipe to connect letters into words that match the color patterns.\n\nTap on a pattern to get a hint.`}</p>
      <div id="rulesDemo"></div>
      <button
        id="rulesClose"
        className="close"
        onClick={() => setDisplay("game")}
      >
        CLOSE
      </button>
      <small id="rulesVersion">version {packageJson.version}</small>
    </div>
  );
}
