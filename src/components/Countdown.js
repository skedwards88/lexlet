import React from "react";

function calculateTimeLeft() {
  const now = new Date();
  const nowHours = now.getHours();
  const nowMinutes = now.getMinutes();
  const nowAbsoluteMinutes = nowMinutes + 60 * nowHours;
  const nextAbsoluteMinutes = (24 + 3) * 60;

  const diffAbsoluteMinutes = nextAbsoluteMinutes - nowAbsoluteMinutes;
  const diffHours = Math.floor(diffAbsoluteMinutes / 60);
  const adjDiffHours = diffHours >= 24 ? diffHours - 24 : diffHours;
  const diffMinutes = diffAbsoluteMinutes % 60;

  return `${adjDiffHours} hr ${diffMinutes} min`;
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());

  React.useEffect(() => {
    const timerID = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timerID);
  });

  return <div>{`Next game in ${timeLeft}`}</div>;
}
