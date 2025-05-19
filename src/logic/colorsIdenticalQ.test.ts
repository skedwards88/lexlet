import type {PrimaryColor} from "../Types";
import {colorsIdenticalQ} from "./colorsIdenticalQ";

describe("colorsIdenticalQ", () => {
  test("identical patterns", () => {
    expect(
      colorsIdenticalQ(["red", "red", "yellow"], ["red", "red", "yellow"]),
    ).toBe(true);
  });

  test("different colors", () => {
    expect(
      colorsIdenticalQ(["red", "red", "yellow"], ["red", "blue", "yellow"]),
    ).toBe(false);
  });

  test("same ratios", () => {
    expect(
      colorsIdenticalQ(
        ["red", "red", "yellow"],
        ["red", "red", "yellow", "yellow", "red", "red"],
      ),
    ).toBe(true);
  });

  test("order doesn't matter", () => {
    expect(
      colorsIdenticalQ(["red", "red", "yellow"], ["red", "yellow", "red"]),
    ).toBe(true);
  });

  test("colors other than red,yellow,blue are ignored", () => {
    expect(
      colorsIdenticalQ(
        ["red", "red", "yellow", "green"] as unknown as PrimaryColor[],
        ["red", "red", "yellow"],
      ),
    ).toBe(true);
  });

  test("works on empty lists", () => {
    expect(colorsIdenticalQ([], [])).toBe(true);
  });
});
