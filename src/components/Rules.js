import React from "react";
import packageJson from "../../package.json";

export default function Rules({setDisplay}) {
  
  return (
    <div className="App info">
      <div className="infoText">
        {<h1>Palette</h1>}
        {`Build words that match the color patterns by swiping to connect adjacent letters.\n\nTap on a pattern to get a hint.\n\n`}
        {<small>version {packageJson.version}</small>}
      </div>
      <button className="close" onClick={() => setDisplay("game")}>
        CLOSE
      </button>
    </div>
  );
}