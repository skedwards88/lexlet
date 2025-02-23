export function isYesterday(timestamp) {
  return isNDaysAgo(timestamp, 1);
}

export function isToday(timestamp) {
  return isNDaysAgo(timestamp, 0);
}

// timestamp is a string like "2025-02-22T23:06:04.621Z"
// numberOfDaysAgo is an int
export function isNDaysAgo(timestamp, numberOfDaysAgo) {
  // need to do date manipulations like setHours and setDate separately from creating the date object because their return values are not a date object
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const comparisonDate = new Date(today);
  comparisonDate.setDate(today.getDate() - numberOfDaysAgo);

  const dateFromTimestamp = new Date(timestamp);
  dateFromTimestamp.setHours(0, 0, 0, 0);

  return dateFromTimestamp.getTime() === comparisonDate.getTime();
}
export function isTomorrow(timestamp) {
  return isNDaysAgo(timestamp, -1);
}
