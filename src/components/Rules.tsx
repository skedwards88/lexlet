import {DisplayState} from "../Types";

export default function Rules({
  setDisplay,
}: {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
}): React.JSX.Element {
  return (
    <div className="App rules">
      <h1 id="rulesHeader">Lexlet: How to play</h1>
      <p className="rulesText">
        Swipe to join connecting letters into words that match the color
        patterns.
      </p>
      <p className="rulesText">Tap on a pattern to get a hint.</p>
      <img src="assets/demo.webp" alt="Demo" id="rulesDemo" />

      <p className="rulesText">
        The daily challenge is easier on Monday and gets harder over the week.
        Can you win every day?
      </p>
      <button
        id="rulesClose"
        className="close"
        onClick={() => {
          setDisplay("game");
        }}
      >
        Play
      </button>
    </div>
  );
}
