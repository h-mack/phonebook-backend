import { test, describe } from "node:test";
import { strictEqual } from "node:assert";
import { reverse } from "../utils/for_testing";

describe("reverse", () => {
  test("reverse of a", (t) => {
    t.skip();
    const result = reverse("a");

    strictEqual(result, "a");
  });

  test("reverse of react", (t) => {
    t.skip();
    const result = reverse("react");

    strictEqual(result, "tcaer");
  });

  test("reverse of saippuakauppias", (t) => {
    t.skip();
    const result = reverse("saippuakauppias");

    strictEqual(result, "saippuakauppias");
  });
});
