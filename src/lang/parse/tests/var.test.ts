import { expect, test } from "vitest"
import { parseExp } from "../index"
import { Var } from "../../Exp"

test("parse var", () => {
  expect(parseExp("x")).toEqual(Var("x", { lo: 0, hi: 1 }))
  expect(parseExp("abc")).toEqual(Var("abc", { lo: 0, hi: 3 }))
})
