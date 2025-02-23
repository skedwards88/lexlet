import React from "react";
import {handleInstall} from "../common/handleInstall";
import {calculateMixedColor} from "./Clues";
import {palette} from "./palette";

export default function ControlBar({
  setDisplay,
  installPromptEvent,
  showInstallButton,
  setInstallPromptEvent,
  swatchAnimationDestinationRef,
  newPaletteIndexes=[],
  isDaily,
}) {
  const flashColors = newPaletteIndexes.map((newIndex) =>
    calculateMixedColor(palette[newIndex]),
  );

  return (
    <div id="controls">
      {isDaily ? (
        <button id="exitDailyButton" onClick={() => setDisplay("game")}>
          Exit daily challenge
        </button>
      ) : (
        <button
          id="calendarButton"
          className="controlButton"
          onClick={() => setDisplay("daily")}
        ></button>
      )}
      <button id="rules" onClick={() => setDisplay("rules")}></button>
      <button
        id="stats"
        ref={swatchAnimationDestinationRef}
        style={{
          "--colorA": `${flashColors[0] || "transparent"}`,
          "--colorB": `${flashColors[1] || "transparent"}`,
          "--colorC": `${flashColors[2] || "transparent"}`,
          "--colorD": `${flashColors[3] || "transparent"}`,
          "--colorE": `${flashColors[4] || "transparent"}`,
        }}
        onClick={() => {
          setDisplay("stats");
        }}
        className={flashColors.length ? "swatchFlash" : ""}
      ></button>
      <button id="heart" onClick={() => setDisplay("heart")}></button>
      {showInstallButton && installPromptEvent ? (
        <button
          id="install"
          onClick={() =>
            handleInstall(installPromptEvent, setInstallPromptEvent)
          }
        ></button>
      ) : (
        <></>
      )}
    </div>
  );
}
