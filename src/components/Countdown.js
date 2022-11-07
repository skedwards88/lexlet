import React from "react";

function calculateTimeLeft() {
  const newDayNumber = new Date().getDate() + 1; // accounts for month change automatically
  const nextGameAtInMilliSec = new Date(new Date().setDate(newDayNumber)).setHours(3,0,0,0)
  const nowInMilliSec = Date.now();
  const minUntilNext = (nextGameAtInMilliSec - nowInMilliSec) / (1000 * 60);
  const displayHourUntilNext = Math.floor(minUntilNext / 60)
  const displayMinUntilNext = Math.floor(minUntilNext % 60)
  return `${displayHourUntilNext}:${displayMinUntilNext}`
}

export function Countdown() {

  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft())

  React.useEffect(() => {
    const timerID = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearTimeout(timerID);
  })

  return <div>{timeLeft}</div>
}
