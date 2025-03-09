import React from "react";
import {calculateMixedColor} from "./Clues";
import {palette} from "./palette";

function Swatch({color, pulseOrder}) {
  return (
    <div
      className="swatch colored"
      style={{backgroundColor: `${color}`, "--i": pulseOrder}}
    ></div>
  );
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
  let pulseOrder = 0;
  const swatches = palette.map((colors, index) => {
    const isColored = stats.collectedSwatchIndexes.includes(index);

    if (isColored) {
      pulseOrder++;
    }

    return isColored ? (
      <Swatch
        color={calculateMixedColor(colors)}
        pulseOrder={pulseOrder}
        key={colors}
      ></Swatch>
    ) : (
      <div className="swatch empty"></div>
    );
  });

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
        Return
      </button>
    </div>
  );
}
