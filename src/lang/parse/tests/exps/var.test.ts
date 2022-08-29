import { expect, test } from "vitest"
import { Var } from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Var", () => {
  expect(parseExp("x")).toMatchObject(deleteUndefined(Var("x")))
  expect(parseExp("abc")).toMatchObject(deleteUndefined(Var("abc")))
})

test("parse Var -- with span", () => {
  expect(parseExp("x")).toMatchObject(Var("x", { lo: 0, hi: 1 }))
  expect(parseExp("abc")).toMatchObject(Var("abc", { lo: 0, hi: 3 }))
  expect(parseExp("  abc")).toMatchObject(Var("abc", { lo: 2, hi: 5 }))
})
