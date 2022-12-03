import React from "react";
import Share from "./Share";
import packageJson from "../../package.json";

export default function Heart({ setDisplay }) {
  const feedbackLink = `https://github.com/skedwards88/palette/issues/new?body=Palette+version+${packageJson.version}`;

  return (
    <div className="App info">
      <div className="infoText">
        {"Like this game? Share it with your friends.\n\n"}
        {<Share text={"Check out this word game!"}></Share>}
        {`\n\n`}
        {<hr></hr>}
        {`\n`}
        {"Feedback? "}
        <a href={feedbackLink}>Open an issue</a>
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
        {<hr></hr>}
        {`\n`}
        <a href="./privacy.html">Privacy policy</a>
      </div>
      <button className="close" onClick={() => setDisplay("game")}>
        CLOSE
      </button>
    </div>
  );
}
