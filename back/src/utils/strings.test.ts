import { isLetters } from "./strings";

test("isLetters", () => {
  expect(isLetters("a2d32r2f")).toEqual(false);
  expect(isLetters("admewfm")).toEqual(true);
});
