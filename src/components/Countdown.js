import React from "react";
import { getPuzzleIndex, startDate } from "../logic/gameInit";

function calculateTimeLeft() {
  const now = new Date();
  const nowHours = now.getHours();
  const nowMinutes = now.getMinutes();
  const nowAbsoluteMinutes = nowMinutes + 60 * nowHours;
  const nextAbsoluteMinutes = (24 + startDate.getHours()) * 60; // 24 hours from reset time (assuming at start of the hour)

  const diffAbsoluteMinutes = nextAbsoluteMinutes - nowAbsoluteMinutes;
  const diffHours = Math.floor(diffAbsoluteMinutes / 60);
  const adjDiffHours = diffHours >= 24 ? diffHours - 24 : diffHours;
  const diffMinutes = diffAbsoluteMinutes % 60;

  return `${adjDiffHours} hr ${diffMinutes} min`;
}

export function Countdown({ dispatchGameState, puzzleIndex }) {
  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());

  React.useEffect(() => {
    const timerID = setTimeout(() => {
      // If past the next game time, get a new game, otherwise decrement the countdown
      const newPuzzleIndex = getPuzzleIndex();
      if (puzzleIndex !== newPuzzleIndex) {
        dispatchGameState({ action: "newGame" });
      } else {
        setTimeLeft(calculateTimeLeft());
      }
    }, 60000);

    return () => clearTimeout(timerID);
  });

  return <small>{`Next game in ${timeLeft}`}</small>;
}
