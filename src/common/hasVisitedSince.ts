import {convertYYYYMMDDToDate} from "./convertYYYYMMDDToDate";

export function hasVisitedSince(
  lastVisitedYYYYMMDD: string | null,
  cutoffYYYYMMDD: string,
): boolean {
  if (!lastVisitedYYYYMMDD) {
    return false;
  }

  const lastVisitedDate = convertYYYYMMDDToDate(lastVisitedYYYYMMDD);

  const resetDate = convertYYYYMMDDToDate(cutoffYYYYMMDD);

  return lastVisitedDate >= resetDate;
}
