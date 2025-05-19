import {isNDaysAgo} from "./isNDaysAgo";

describe("isNDaysAgo", () => {
  test("should return true if the date is today", () => {
    const today = new Date().toISOString();
    expect(isNDaysAgo(today, 0)).toBe(true);
  });

  test("should return true if the date is yesterday", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isNDaysAgo(yesterday.toISOString(), 1)).toBe(true);
  });

  test("should return true if the date is tomorrow", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(isNDaysAgo(tomorrow.toISOString(), -1)).toBe(true);
  });

  test("should return true if the date is 5 days ago", () => {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    expect(isNDaysAgo(fiveDaysAgo.toISOString(), 5)).toBe(true);
  });

  test("should return true if the date is 5 days in the future", () => {
    const fiveDaysInFuture = new Date();
    fiveDaysInFuture.setDate(fiveDaysInFuture.getDate() + 5);
    expect(isNDaysAgo(fiveDaysInFuture.toISOString(), -5)).toBe(true);
  });

  test("should return false for a date that is not the correct number of days ago", () => {
    const today = new Date().toISOString();
    expect(isNDaysAgo(today, 1)).toBe(false);
  });
});
