import {getSimilarityScore, getMaxSimilarityScore} from "./similarityScore";

describe("getSimilarityScore", () => {
  test("identical words", () => {
    expect(getSimilarityScore("BOOK", "BOOK")).toBe(1);
  });

  test("the same word with 's' appended", () => {
    expect(getSimilarityScore("BOOK", "BOOKS")).toBe(1);
    expect(getSimilarityScore("BOOKS", "BOOK")).toBe(1);
  });

  test("words that share the first letters", () => {
    expect(getSimilarityScore("CAKE", "CAMPER")).toBe((2 / 4 + 2 / 6) / 2);
    expect(getSimilarityScore("SONG", "SONAR")).toBe((3 / 4 + 3 / 5) / 2);
    expect(getSimilarityScore("SINGING", "SING")).toBe((4 / 7 + 4 / 4) / 2);
  });

  test("words that share the last letters", () => {
    expect(getSimilarityScore("CAKE", "LIKE")).toBe((2 / 4 + 2 / 4) / 2);
    expect(getSimilarityScore("CAMPER", "SWIMMER")).toBe((2 / 6 + 2 / 7) / 2);
    expect(getSimilarityScore("LIKING", "SING")).toBe((3 / 6 + 3 / 4) / 2);
  });

  test("words that share the any stretch of four letters", () => {
    expect(getSimilarityScore("BAKER", "MAKERS")).toBe((4 / 5 + 4 / 6) / 2);
    expect(getSimilarityScore("COOKBOOK", "BOOKS")).toBe((4 / 8 + 4 / 5) / 2);
  });

  test("words that share the any stretch of three letters", () => {
    expect(getSimilarityScore("CAKES", "MAKE")).toBe((3 / 5 + 3 / 4) / 2);
    expect(getSimilarityScore("BOOK", "COOKING")).toBe((3 / 4 + 3 / 7) / 2);
    expect(getSimilarityScore("TEAMMATE", "STREAM")).toBe((3 / 8 + 3 / 6) / 2);
  });

  test("words that don't match other criteria", () => {
    expect(getSimilarityScore("CAKES", "MADE")).toBe(0);
    expect(getSimilarityScore("BOOK", "COOLING")).toBe(0);
    expect(getSimilarityScore("TEAMMATE", "STEM")).toBe(0);
  });

  test("case matters", () => {
    expect(getSimilarityScore("book", "BOOK")).toBe(0);
  });
});

describe("getMaxSimilarityScore", () => {
  test("list includes identical words", () => {
    expect(
      getMaxSimilarityScore(
        ["BOOK", "READ"],
        ["EDIT", "TEXT", "BOOK", "WRITE"],
      ),
    ).toBe(1);
  });

  test("list includes pluralized identical words", () => {
    expect(
      getMaxSimilarityScore(
        ["EDIT", "TEXT", "BOOKS", "WRITE"],
        ["BOOK", "READ"],
      ),
    ).toBe(1);
  });

  test("list includes similar but not identical words", () => {
    expect(
      getMaxSimilarityScore(["BOOK", "READ"], ["COOKING", "TEXT", "WRITE"]),
    ).toBe((3 / 4 + 3 / 7) / 2);
  });

  test("list includes dissimilar words", () => {
    expect(
      getMaxSimilarityScore(["BOOK", "READ"], ["COOLING", "TEXT", "WRITE"]),
    ).toBe(0);
  });
});
