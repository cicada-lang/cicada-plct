import { expect, test } from "vitest"
import { isIdentifier } from "./isIdentifier.js"

test("isIdentifier", () => {
  expect(isIdentifier("_")).toBe(true)
  expect(isIdentifier("123")).toBe(false)
  expect(isIdentifier("_123")).toBe(true)
  expect(isIdentifier("a")).toBe(true)
  expect(isIdentifier(" a")).toBe(false)
  expect(isIdentifier("a ")).toBe(false)
  expect(isIdentifier("a,b")).toBe(false)
})
