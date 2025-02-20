import {convertYYYYMMDDToDate} from "./convertYYYYMMDDToDate";

export function hasVisitedSince(lastVisitedYYYYMMDD, cutoffYYYYMMDD) {
  if (!lastVisitedYYYYMMDD) {
    return false;
  }

  const lastVisitedDate = convertYYYYMMDDToDate(lastVisitedYYYYMMDD);

  const resetDate = convertYYYYMMDDToDate(cutoffYYYYMMDD);

  return lastVisitedDate >= resetDate;
}
