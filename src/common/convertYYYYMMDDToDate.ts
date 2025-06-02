export function convertYYYYMMDDToDate(YYYYMMDD: string): Date {
  return new Date(
    parseInt(YYYYMMDD.slice(0, 4)),
    parseInt(YYYYMMDD.slice(4, 6)) - 1, // months are 0-indexed
    parseInt(YYYYMMDD.slice(6, 8)),
  );
}
