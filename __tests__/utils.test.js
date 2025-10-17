const {
  convertTimestampToDate,
  createLookupObject,
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createLookupObject", () => {
  test("should return an empty object when given an empty array", () => {
    expect(createLookupObject([], "name", "id")).toEqual({});
  });
  test("should return a single key/value pair when given an array with one object", () => {
    const arr = [{ id: 1, name: "Jim", age: 20 }];
    const expected = { Jim: 1 };
    expect(createLookupObject(arr, "name", "id")).toEqual(expected);
  });
  test("should return an object mapping keys to values when given multiple objects", () => {
    const arr = [
      { id: 1, name: "Jim", age: 20 },
      { id: 2, name: "Jhon", age: 25 },
      { id: 3, name: "Smith", age: 30 },
    ];
    const expected = { Jim: 1, Jhon: 2, Smith: 3 };
    expect(createLookupObject(arr, "name", "id")).toEqual(expected);
  });
  test("should return an object mapping keys to alternate property values when given different key/value arguments", () => {
    const arr = [
      { id: 1, name: "Jim", age: 20 },
      { id: 2, name: "Jhon", age: 25 },
      { id: 3, name: "Smith", age: 30 },
    ];
    const expected = { Jim: 20, Jhon: 25, Smith: 30 };
    expect(createLookupObject(arr, "name", "age")).toEqual(expected);
  });
  test("should skip objects missing either key or value properties", () => {
    const arr = [{ id: 1, name: "Jim" }, { id: 2 }, { name: "Smith" }];
    const expected = { Jim: 1 };
    expect(createLookupObject(arr, "name", "id")).toEqual(expected);
  });
  test("should handle non-string key and value types correctly", () => {
    const arr = [
      { key: 1, value: true },
      { key: 2, value: false },
    ];
    const expected = { 1: true, 2: false };
    expect(createLookupObject(arr, "key", "value")).toEqual(expected);
  });
  test("should not mutate the original array", () => {
    const arr = [
      { id: 1, name: "Jim" },
      { id: 2, name: "Jhon" },
    ];
    const arrCopy = [...arr];

    createLookupObject(arr, "name", "id");

    expect(arr).toEqual(arrCopy);
  });
});
