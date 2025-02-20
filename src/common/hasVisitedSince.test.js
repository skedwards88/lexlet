import {hasVisitedSince} from "./hasVisitedSince";

describe("hasVisitedSince", () => {
  test("returns false if lastVisited is not set", () => {
    expect(hasVisitedSince(null, "20240429")).toBe(false);
  });

  test("returns false if lastVisited is a date before the cutoff date", () => {
    expect(hasVisitedSince("20240428", "20240429")).toBe(false);
  });

  test("returns true if lastVisited is the cutoff date", () => {
    expect(hasVisitedSince("20240429", "20240429")).toBe(true);
  });

  test("returns true if lastVisited is after the cutoff date", () => {
    expect(hasVisitedSince("20240430", "20240429")).toBe(true);
  });
});
