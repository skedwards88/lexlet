import { getSimilarityScore, getMaxSimilarityScore } from "./similarityScore";

describe("getSimilarityScore", () => {
  test("identical words", () => {
    expect(getSimilarityScore("BOOK", "BOOK")).toBe(1);
  });

  test("the same word with 's' appended", () => {
    expect(getSimilarityScore("BOOK", "BOOKS")).toBe(1);
    expect(getSimilarityScore("BOOKS", "BOOK")).toBe(1);
  });

  test("words that share the first two letters", () => {
    expect(getSimilarityScore("CAKE", "CAMPER")).toBe(0.5);
    expect(getSimilarityScore("SONG", "SONAR")).toBe(0.5);
    expect(getSimilarityScore("SINGING", "SING")).toBe(0.5);
  });

  test("words that share the last two letters", () => {
    expect(getSimilarityScore("CAKE", "LIKE")).toBe(0.5);
    expect(getSimilarityScore("CAMPER", "SWIMMER")).toBe(0.5);
    expect(getSimilarityScore("LIKING", "SONG")).toBe(0.5);
  });

  test("words that share the any stretch of three letters", () => {
    expect(getSimilarityScore("CAKES", "MAKE")).toBe(0.5);
    expect(getSimilarityScore("BOOK", "COOKING")).toBe(0.5);
    expect(getSimilarityScore("TEAMMATE", "STREAM")).toBe(0.5);
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
      getMaxSimilarityScore(["BOOK", "READ"], ["EDIT", "TEXT", "BOOK", "WRITE"])
    ).toBe(1);
  });

  test("list includes pluralized identical words", () => {
    expect(
      getMaxSimilarityScore(
        ["EDIT", "TEXT", "BOOKS", "WRITE"],
        ["BOOK", "READ"]
      )
    ).toBe(1);
  });

  test("list includes similar but not identical words", () => {
    expect(
      getMaxSimilarityScore(["BOOK", "READ"], ["COOKING", "TEXT", "WRITE"])
    ).toBe(0.5);
  });

  test("list includes dissimilar words", () => {
    expect(
      getMaxSimilarityScore(["BOOK", "READ"], ["COOLING", "TEXT", "WRITE"])
    ).toBe(0);
  });
});
