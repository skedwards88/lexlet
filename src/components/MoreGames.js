import React from "react";
import Share from "./Share";
import packageJson from "../../package.json";

export default function MoreGames({setDisplay}) {
  // To add a new game:
  // - add it to the list here
  // - add a webp screenshot under images/moreGames
  // - reference the screenshot in src/styles/MoreGames.css
  const games = {
    crossjig: "https://crossjig.com",
    blobble: "https://skedwards88.github.io/blobble/",
    wordfall: "https://skedwards88.github.io/wordfall/",
    gribbles: "https://skedwards88.github.io/gribbles/",
    logicGrid: "https://skedwards88.github.io/logic-grid/",
  };

  const gameElements = Object.keys(games).map((game, index) => (
    <a
      key={index}
      href={games[game]}
      className={`game-image ${game}`}
      role="img"
      aria-label={`Screenshot of the ${game} game.`}
    ></a>
  ));
  return (
    <div className="App info">
      <div className="infoText">
        {`Want more games? Check these out, or see all of our puzzle games `}
        <a href="https://skedwards88.github.io/">here</a>
        {`. `}

        <div id="moreGames">{gameElements}</div>
      </div>

      <hr />

      <p>Like this game? Share it with your friends.</p>
      <Share text={"Check out this word game!"}></Share>

      <hr></hr>

      <p>
        Feedback?{" "}
        <a href="https://github.com/skedwards88/lexlet/issues/new/choose">
          Open an issue
        </a>{" "}
        on GitHub or email SECTgames@gmail.com.
      </p>

      <hr />

      <p>
        Thanks to the word frequency data sources attributed in{" "}
        <a href="https://github.com/skedwards88/word_lists">
          skedwards88/word_lists
        </a>
        .
      </p>

      <hr />

      <a href="./privacy.html">Privacy policy</a>
      <small>tl;dr: We only collect anonymous data about usage.</small>

      <hr />

      <button className="close" onClick={() => setDisplay("game")}>
        Close
      </button>

      <small id="rulesVersion">version {packageJson.version}</small>
    </div>
  );
}
