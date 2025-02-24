import React from "react";

export default function Settings({setDisplay, dispatchGameState, gameState}) {
  function handleNewGame(event) {
    event.preventDefault();
    const newDifficultyLevel = parseInt(
      event.target.elements.difficultyLevel.value,
    );

    dispatchGameState({
      action: "newGame",
      difficultyLevel: newDifficultyLevel,
    });
    setDisplay("game");
  }

  return (
    <form className="App settings" onSubmit={(e) => handleNewGame(e)}>
      <div id="settings">
        <div className="setting">
          <div className="setting-description">
            <label htmlFor="difficultyLevel">Difficulty</label>
          </div>
          <div id="settingSliderContainer">
            <div className="settingSliderValue">–</div>
            <input
              id="difficultyLevel"
              className="difficultyLevel"
              type="range"
              min="1"
              max="7"
              defaultValue={gameState.difficultyLevel || "3"}
            />
            <div className="settingSliderValue">+</div>
          </div>
        </div>
      </div>
      <div id="setting-buttons">
        <button type="submit" aria-label="new game">
          New game
        </button>
        <button
          type="button"
          aria-label="cancel"
          onClick={() => setDisplay("game")}
        >
          Return
        </button>
      </div>
    </form>
  );
}
