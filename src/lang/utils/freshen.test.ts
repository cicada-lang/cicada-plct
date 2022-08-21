import { expect, test } from "vitest"
import { freshen } from "./freshen"

test("freshen create new string not in set", () => {
  expect(freshen(new Set(["x"]), "x")).toBe("x1")
  expect(freshen(new Set(["x", "x1"]), "x")).toBe("x2")
  expect(freshen(new Set(["x", "x1", "x2"]), "x")).toBe("x3")
})
