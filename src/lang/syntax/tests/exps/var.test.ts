import { expect, test } from "vitest"
import * as Exps from "../../../exp/index.js"
import { parseExp } from "../../index.js"
import { deleteUndefined } from "../utils.js"

test("parse Var", () => {
  expect(parseExp("x")).toMatchObject(deleteUndefined(Exps.Var("x")))
  expect(parseExp("abc")).toMatchObject(deleteUndefined(Exps.Var("abc")))
})

test("parse Var -- with span", () => {
  expect(parseExp("x")).toMatchObject(Exps.Var("x", { lo: 0, hi: 1 }))
  expect(parseExp("abc")).toMatchObject(Exps.Var("abc", { lo: 0, hi: 3 }))
  expect(parseExp("  abc")).toMatchObject(Exps.Var("abc", { lo: 2, hi: 5 }))
})
