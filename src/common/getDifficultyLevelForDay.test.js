import {getDifficultyLevelForDay} from "./getDifficultyLevelForDay";

describe("Testing with mocked dates", () => {
  let actualDate;

  function mockDate(desiredValue) {
    actualDate = Date;
    global.Date = jest.fn(() => ({
      ...actualDate.prototype,
      getDay: jest.fn(() => desiredValue),
    }));
    global.Date.now = jest.fn(() => actualDate.now());
  }

  afterEach(() => {
    global.Date = actualDate;
  });

  test("Test with Date.getDay() mocked to 1", () => {
    mockDate(1);
    expect(getDifficultyLevelForDay()).toEqual(1);
  });

  test("Test with Date.getDay() mocked to 2", () => {
    mockDate(2);
    expect(getDifficultyLevelForDay()).toEqual(2);
  });

  test("Test with Date.getDay() mocked to 3", () => {
    mockDate(3);
    expect(getDifficultyLevelForDay()).toEqual(3);
  });

  test("Test with Date.getDay() mocked to 4", () => {
    mockDate(4);
    expect(getDifficultyLevelForDay()).toEqual(4);
  });

  test("Test with Date.getDay() mocked to 5", () => {
    mockDate(5);
    expect(getDifficultyLevelForDay()).toEqual(5);
  });

  test("Test with Date.getDay() mocked to 6", () => {
    mockDate(6);
    expect(getDifficultyLevelForDay()).toEqual(6);
  });

  test("Test with Date.getDay() mocked to 0", () => {
    mockDate(0);
    expect(getDifficultyLevelForDay()).toEqual(7);
  });
});
