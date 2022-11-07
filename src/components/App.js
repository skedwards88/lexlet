import React from "react";
import Palette from "./Palette";
import Heart from "./Heart";

export default function App() {
  const [display, setDisplay] = React.useState("game");

  switch (display) {
    case "game":
      return <Palette setDisplay={setDisplay}></Palette>;

    case "rules":
      return (
        <div className="App info">
          <div>
            {<h1>Palette</h1>}
            {`Build words that match the color patterns by swiping to connect adjacent letters.\n\nTap on a clue to get a hint.\n\n`}
            {<small>version 0.0.3</small>}
          </div>
          <button className="close" onClick={() => setDisplay("game")}>
            CLOSE
          </button>
        </div>
      );

    case "heart":
      return <Heart setDisplay={setDisplay}></Heart>

    default:
      return <Palette setDisplay={setDisplay}></Palette>;
  }
}
