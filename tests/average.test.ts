import { test, describe } from "node:test";
import { strictEqual } from "node:assert";
import { average } from "../utils/for_testing";

describe("average", () => {
  test("of one value is the value of itself", (t) => {
    t.skip();
    strictEqual(average([1]), 1);
  });
  test("of many is calculated correctly", (t) => {
    t.skip();
    strictEqual(average([1, 2, 3, 4, 5]), 3);
  });
  test("of empty array is zero", (t) => {
    t.skip();
    strictEqual(average([]), 0);
  });
});
