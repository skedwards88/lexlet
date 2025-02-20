import {convertYYYYMMDDToDate} from "./convertYYYYMMDDToDate";

export function hasVisitedSince(lastVisitedYYYYMMDD, cutoffYYYMMDD) {
  if (!lastVisitedYYYYMMDD) {
    return false;
  }

  const lastVisitedDate = convertYYYYMMDDToDate(lastVisitedYYYYMMDD);

  const resetDate = convertYYYYMMDDToDate(cutoffYYYMMDD);

  return lastVisitedDate >= resetDate;
}
