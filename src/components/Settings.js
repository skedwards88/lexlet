import React from "react";

export default function Settings({ dispatchGameState, gameState }) {
  const [showSettings, setShowSettings] = React.useState(false);

  function handleShowSettings() {
    setShowSettings(!showSettings);
  }

  function handleNewGame(event) {
    event.preventDefault();
    const newMinWordLength = parseInt(event.target.elements.minWordLength.value);

    dispatchGameState({
      action: "newGame",
      minWordLength: newMinWordLength,
    });
    setShowSettings(false);
  }

  return showSettings ? (
    <form className="modal" onSubmit={(e) => handleNewGame(e)}>
      <div id="settings">
        <div className="setting">
          <div className="setting-description">
            <label htmlFor="minWordLength">Min word length</label>
            <div className="setting-info">
              Answers will have at least this many letters.
            </div>
          </div>
          <select
            id="minWordLength"
            defaultValue={gameState.minWordLength || 4}
          >
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>
      </div>
      <div id="setting-buttons">
        <button type="submit" aria-label="new game">
          New Game
        </button>
        <button
          type="button"
          aria-label="cancel"
          onClick={() => handleShowSettings()}
        >
          Cancel
        </button>
      </div>
    </form>
  ) : (
    <button id="settingsButton" onClick={() => handleShowSettings()}></button>
  );
}
