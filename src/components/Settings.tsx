import type {GameState} from "../logic/gameInit";
import type {ReducerPayload} from "../logic/gameReducer";
import type {DisplayState} from "./App";

interface NewGameFormElements extends HTMLFormControlsCollection {
  difficultyLevel: HTMLInputElement;
}

interface NewGameFormElement extends HTMLFormElement {
  readonly elements: NewGameFormElements;
}

export default function Settings({
  setDisplay,
  dispatchGameState,
  gameState,
}: {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
  dispatchGameState: React.Dispatch<ReducerPayload>;
  gameState: GameState;
}): React.JSX.Element {
  function handleNewGame(event: React.SubmitEvent<NewGameFormElement>): void {
    event.preventDefault();
    const newDifficultyLevel = parseInt(
      event.currentTarget.elements.difficultyLevel.value,
    );

    dispatchGameState({
      action: "newGame",
      difficultyLevel: newDifficultyLevel,
    });
    setDisplay("game");
  }

  return (
    <form className="App settings" onSubmit={handleNewGame}>
      <div id="settings">
        <div className="setting">
          <div className="setting-description">
            <label htmlFor="difficultyLevel">Difficulty</label>
          </div>
          <div id="settingSliderContainer">
            {/* Ignore the warning about the en dash being confusing here */}
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
