import React from "react";
import Palette from "./Palette";
import Share from "./Share";

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
      return (
        <div className="App info">
          <div>
            {"Like this game? Share it with your friends.\n\n"}
            {<Share text={"Check out this word game!"}></Share>}
            {`\n\n`}
            {<hr></hr>}
            {`\n`}
            {"Feedback? "}
            <a href="https://github.com/skedwards88/palette/issues/new">
              Open an issue
            </a>
            {" on GitHub."}
            {`\n\n`}
            {<hr></hr>}
            {`\n`}
            {`Thanks to `}
            <a href="https://github.com/wordnik/wordlist">Wordnik</a>
            {` for their open source word list and `}
            <a href="https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists#English">
              Wiktionary
            </a>
            {` and data therein for word frequency data.`}
          </div>
          <button className="close" onClick={() => setDisplay("game")}>
            CLOSE
          </button>
        </div>
      );

    default:
      return <Palette setDisplay={setDisplay}></Palette>;
  }
}
