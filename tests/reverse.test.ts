import { test, describe } from "node:test";
import { strictEqual } from "node:assert";
import { reverse } from "../utils/for_testing";

describe("reverse", () => {
  test("reverse of a", () => {
    const result = reverse("a");

    strictEqual(result, "a");
  });

  test("reverse of react", () => {
    const result = reverse("react");

    strictEqual(result, "tcaer");
  });

  test("reverse of saippuakauppias", () => {
    const result = reverse("saippuakauppias");

    strictEqual(result, "saippuakauppias");
  });
});
