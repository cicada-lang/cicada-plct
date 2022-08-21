import { expect, test } from "vitest"

test("example", () => {
  expect(1 + 1).toBe(2)
  expect({ message: "hi" }).toEqual({ message: "hi" })
})
