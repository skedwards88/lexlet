import React from "react";
import {calculateMixedColor} from "./Clues";
import {palette} from "./palette";

function Swatch({color}) {
  return <div className="swatch" style={{backgroundColor: `${color}`}}></div>;
}

function StatsNumber({number, text}) {
  return (
    <div className="statsNumber">
      <div className="number">{number}</div>
      <div>{text}</div>
    </div>
  );
}

export default function Stats({stats, setDisplay}) {
  const swatches = palette.map((colors, index) => (
    <Swatch
      color={
        stats.collectedSwatchIndexes.includes(index)
          ? calculateMixedColor(colors)
          : ""
      }
      key={colors}
    ></Swatch>
  ));

  return (
    <div className="App stats">
      <p>{`Collected ${stats.collectedSwatchIndexes.length} of ${palette.length} colors`}</p>
      <div id="palette">{swatches}</div>
      <div id="numbers">
        <StatsNumber number={stats.streak} text={"daily streak"}></StatsNumber>

        <StatsNumber number={stats.maxStreak} text={"max streak"}></StatsNumber>
      </div>

      <small>{`Stats are stored locally on your device/browser.`}</small>
      <button
        className="close"
        id="statsClose"
        onClick={() => setDisplay("game")}
      >
        CLOSE
      </button>
    </div>
  );
}
