import type {DisplayState, Stats} from "../Types";
import {calculateMixedColor} from "./Clues";
import {palette} from "./palette";

function Swatch({
  color,
  pulseOrder,
}: {
  color: string;
  pulseOrder: number;
}): React.JSX.Element {
  return (
    <div
      className="swatch colored"
      style={
        {backgroundColor: `${color}`, "--i": pulseOrder} as React.CSSProperties
      }
    ></div>
  );
}

function StatsNumber({
  number,
  text,
}: {
  number: number;
  text: string;
}): React.JSX.Element {
  return (
    <div className="statsNumber">
      <div className="number">{number}</div>
      <div>{text}</div>
    </div>
  );
}

function pickRandomIntBetween(int1: number, int2: number): number {
  const min = Math.min(int1, int2);
  const max = Math.max(int1, int2);

  // To make it inclusive, need max + 1
  return Math.floor(min + Math.random() * (max + 1 - min));
}

export default function Stats({
  stats,
  setDisplay,
}: {
  stats: Stats;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
}): React.JSX.Element {
  const maxPulseOrder = stats.collectedSwatchIndexes.length;

  const swatches = palette.map((colors, index) => {
    const isColored = stats.collectedSwatchIndexes.includes(index);

    return isColored ? (
      <Swatch
        color={calculateMixedColor(colors)}
        // Doing pulseOrder like this to give the possibility of having multiple swatches pulse at the same time.
        // The animation is fast enough that the pause if that happens still looks cohesive.
        pulseOrder={pickRandomIntBetween(1, maxPulseOrder)}
        key={`${colors}`}
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
