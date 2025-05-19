import {
  getWordSimilarityScore,
  getMaxWordSimilarityScore,
  getColorSimilarityScore,
} from "./similarityScore";

describe("getColorSimilarityScore", () => {
  test("identical patterns", () => {
    expect(getColorSimilarityScore("rrbyb", "rrbyb")).toBe(1);
  });

  test("same colors in different order", () => {
    expect(getColorSimilarityScore("rybyb", "yrbby")).toBe(1);
  });

  test("same r only", () => {
    expect(getColorSimilarityScore("rrbyb", "rrbbb")).toBe(0);
  });

  test("same b only", () => {
    expect(getColorSimilarityScore("rybyb", "bybrr")).toBe(0);
  });

  test("same y only", () => {
    expect(getColorSimilarityScore("bybyb", "yrbby")).toBe(0);
  });

  test("same r only, different length", () => {
    expect(getColorSimilarityScore("rrbyb", "rrbybb")).toBe(0);
  });

  test("same b only, different length", () => {
    expect(getColorSimilarityScore("rrbyby", "rrbyb")).toBe(0);
  });

  test("same y only, different length", () => {
    expect(getColorSimilarityScore("rrbybb", "rrbyb")).toBe(0);
  });
});

describe("getWordSimilarityScore", () => {
  test("identical words", () => {
    expect(getWordSimilarityScore("BOOK", "BOOK")).toBe(1);
  });

  test("the same word with 's' appended", () => {
    expect(getWordSimilarityScore("BOOK", "BOOKS")).toBe(1);
    expect(getWordSimilarityScore("BOOKS", "BOOK")).toBe(1);
  });

  test("words that share the first letters", () => {
    expect(getWordSimilarityScore("CAKE", "CAMPER")).toBe((2 / 4 + 2 / 6) / 2);
    expect(getWordSimilarityScore("SONG", "SONAR")).toBe((3 / 4 + 3 / 5) / 2);
    expect(getWordSimilarityScore("SINGING", "SING")).toBe((4 / 7 + 4 / 4) / 2);
  });

  test("words that share the last letters", () => {
    expect(getWordSimilarityScore("CAKE", "LIKE")).toBe((2 / 4 + 2 / 4) / 2);
    expect(getWordSimilarityScore("CAMPER", "SWIMMER")).toBe(
      (2 / 6 + 2 / 7) / 2,
    );
    expect(getWordSimilarityScore("LIKING", "SING")).toBe((3 / 6 + 3 / 4) / 2);
  });

  test("words that share the any stretch of four letters", () => {
    expect(getWordSimilarityScore("BAKER", "MAKERS")).toBe((4 / 5 + 4 / 6) / 2);
    expect(getWordSimilarityScore("COOKBOOK", "BOOKS")).toBe(
      (4 / 8 + 4 / 5) / 2,
    );
  });

  test("words that share the any stretch of three letters", () => {
    expect(getWordSimilarityScore("CAKES", "MAKE")).toBe((3 / 5 + 3 / 4) / 2);
    expect(getWordSimilarityScore("BOOK", "COOKING")).toBe((3 / 4 + 3 / 7) / 2);
    expect(getWordSimilarityScore("TEAMMATE", "STREAM")).toBe(
      (3 / 8 + 3 / 6) / 2,
    );
  });

  test("words that don't match other criteria", () => {
    expect(getWordSimilarityScore("CAKES", "MADE")).toBe(0);
    expect(getWordSimilarityScore("BOOK", "COOLING")).toBe(0);
    expect(getWordSimilarityScore("TEAMMATE", "STEM")).toBe(0);
  });

  test("case matters", () => {
    expect(getWordSimilarityScore("book", "BOOK")).toBe(0);
  });
});

describe("getMaxWordSimilarityScore", () => {
  test("list includes identical words", () => {
    expect(
      getMaxWordSimilarityScore(
        ["BOOK", "READ"],
        ["EDIT", "TEXT", "BOOK", "WRITE"],
      ),
    ).toBe(1);
  });

  test("list includes pluralized identical words", () => {
    expect(
      getMaxWordSimilarityScore(
        ["EDIT", "TEXT", "BOOKS", "WRITE"],
        ["BOOK", "READ"],
      ),
    ).toBe(1);
  });

  test("list includes similar but not identical words", () => {
    expect(
      getMaxWordSimilarityScore(["BOOK", "READ"], ["COOKING", "TEXT", "WRITE"]),
    ).toBe((3 / 4 + 3 / 7) / 2);
  });

  test("list includes dissimilar words", () => {
    expect(
      getMaxWordSimilarityScore(["BOOK", "READ"], ["COOLING", "TEXT", "WRITE"]),
    ).toBe(0);
  });
});
