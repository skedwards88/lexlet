import React from "react";
import {handleInstall} from "../common/handleInstall";
import {calculateMixedColor} from "./Clues";
import {palette} from "./palette";
import {handleShare} from "../common/handleShare";

export default function ControlBar({
  setDisplay,
  installPromptEvent,
  showInstallButton,
  setInstallPromptEvent,
  swatchAnimationDestinationRef,
  newPaletteIndexes = [],
  isDaily,
  dailyIsSolved,
  dispatchGameState,
  gameState,
}) {
  const flashColors = newPaletteIndexes.map((newIndex) =>
    calculateMixedColor(palette[newIndex]),
  );

  return (
    <div id="controls">
      {isDaily ? (
        <button id="exitDailyButton" onClick={() => setDisplay("game")}>
          Exit daily
        </button>
      ) : (
        <>
          <button
            id={dailyIsSolved ? "calendarButtonSolved" : "calendarButton"}
            className="controlButton"
            onClick={() => setDisplay("daily")}
          ></button>
          <button
            id="newGameButton"
            className="controlButton"
            onClick={() => {
              dispatchGameState({
                ...gameState,
                action: "newGame",
              });
            }}
          ></button>
          <button
            id="settingsButton"
            className="controlButton"
            onClick={() => setDisplay("settings")}
          ></button>
        </>
      )}

      <button
        id="rulesButton"
        className="controlButton"
        onClick={() => setDisplay("rules")}
      ></button>

      <button
        id="heartButton"
        className="controlButton"
        onClick={() => setDisplay("heart")}
      ></button>

      {navigator.canShare ? (
        <button
          id="shareButton"
          className="controlButton"
          onClick={() => {
            handleShare({
              appName: "Lexlet",
              text: "Check out this word puzzle!",
              url: "https://lexlet.com/",
            });
          }}
        ></button>
      ) : (
        <></>
      )}

      <button
        id="statsButton"
        className={
          flashColors.length ? "controlButton swatchFlash" : "controlButton"
        }
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
      ></button>
      {showInstallButton && installPromptEvent ? (
        <button
          id="installButton"
          className="controlButton"
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
