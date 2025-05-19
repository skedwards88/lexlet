import React from "react";
import getDailySeed from "../common/getDailySeed";
import type {GameReducerPayload} from "../Types";

function calculateTimeLeft(): string {
  const now = new Date();
  const nowHours = now.getHours();
  const nowMinutes = now.getMinutes();
  const nowAbsoluteMinutes = nowMinutes + 60 * nowHours;
  const nextAbsoluteMinutes = 24 * 60; // 24 hours

  const diffAbsoluteMinutes = nextAbsoluteMinutes - nowAbsoluteMinutes;
  const diffHours = Math.floor(diffAbsoluteMinutes / 60);
  const adjDiffHours = diffHours >= 24 ? diffHours - 24 : diffHours;
  const diffMinutes = diffAbsoluteMinutes % 60;

  return `${adjDiffHours} hr ${diffMinutes} min`;
}

export function Countdown({
  dispatchGameState,
  seed,
}: {
  dispatchGameState: React.Dispatch<GameReducerPayload>;
  seed: string;
}): React.JSX.Element {
  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());

  React.useEffect(() => {
    const timerID = setTimeout(() => {
      // If past the next game time, get a new game, otherwise decrement the countdown
      const newSeed = getDailySeed();
      if (seed !== newSeed) {
        dispatchGameState({action: "newGame"});
      } else {
        setTimeLeft(calculateTimeLeft());
      }
    }, 60000);

    return (): void => clearTimeout(timerID);
  });

  return <p>{`Next daily challenge in \n${timeLeft}`}</p>;
}
