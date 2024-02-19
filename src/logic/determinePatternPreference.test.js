import {determinePatternPreference} from "./determinePatternPreference";

describe("determinePatternPreference", () => {
  const patternData = {
    pattern1: {
      sumSimilarityScore: 0,
      indexes: [[1, 3, 5, 4]],
      words: new Set(["BOOK"]),
    },
    pattern2: {
      sumSimilarityScore: 0,
      indexes: [
        [1, 3, 5, 4],
        [1, 3, 5, 2],
      ],
      words: new Set(["BOOK", "READ"]),
    },
    pattern3: {
      sumSimilarityScore: 3.5,
      indexes: [[1, 3, 5, 4]],
      words: new Set(["BOOK"]),
    },
    pattern4: {
      sumSimilarityScore: 3.5,
      indexes: [
        [1, 3, 5, 4],
        [1, 3, 5, 8],
      ],
      words: new Set(["BOOK", "WORD"]),
    },
    pattern5: {
      sumSimilarityScore: 3.5,
      indexes: [
        [1, 3, 5, 4, 7],
        [1, 3, 5, 4, 8],
      ],
      words: new Set(["WRITE", "LOGIC"]),
    },
    pattern6: {
      sumSimilarityScore: 3.5,
      indexes: [
        [1, 3, 5, 4, 7],
        [1, 3, 5, 4, 8],
      ],
      words: new Set(["BOOKS", "LOGIC"]),
    },
  };
  test("different similarity score", () => {
    expect(
      determinePatternPreference("pattern1", "pattern3", patternData),
    ).toBe(-1);
    expect(
      determinePatternPreference("pattern3", "pattern1", patternData),
    ).toBe(1);
  });

  test("same similarity score, different number solutions", () => {
    expect(
      determinePatternPreference("pattern1", "pattern2", patternData),
    ).toBe(1);
    expect(
      determinePatternPreference("pattern2", "pattern1", patternData),
    ).toBe(-1);
  });

  test("same similarity score, same number solutions, different length", () => {
    expect(
      determinePatternPreference("pattern4", "pattern5", patternData),
    ).toBe(-1);
    expect(
      determinePatternPreference("pattern5", "pattern4", patternData),
    ).toBe(1);
  });

  test("same similarity score, different number 's', same number solutions, same length", () => {
    expect(
      determinePatternPreference("pattern6", "pattern5", patternData),
    ).toBe(1);
    expect(
      determinePatternPreference("pattern5", "pattern6", patternData),
    ).toBe(-1);
  });

  test("can be used to sort", () => {
    let potentialPatterns = Object.keys(patternData);
    potentialPatterns.sort((patternA, patternB) =>
      determinePatternPreference(patternA, patternB, patternData),
    );
    expect(potentialPatterns).toEqual([
      "pattern2",
      "pattern1",
      "pattern4",
      "pattern5",
      "pattern3",
      "pattern6",
    ]);
  });
});
