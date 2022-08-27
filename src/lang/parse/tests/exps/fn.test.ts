import { expect, test } from "vitest"
import { Fn, FnBindingName, Var } from "../../../Exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Fn", () => {
  expect(parseExp("(x) => x")).toMatchObject(
    deleteUndefined(Fn([FnBindingName("x")], Var("x")))
  )

  expect(parseExp("function (x) x")).toMatchObject(
    deleteUndefined(Fn([FnBindingName("x")], Var("x")))
  )

  expect(parseExp("(x, y) => x")).toMatchObject(
    deleteUndefined(Fn([FnBindingName("x"), FnBindingName("y")], Var("x")))
  )

  expect(parseExp("function (x, y) x")).toMatchObject(
    deleteUndefined(Fn([FnBindingName("x"), FnBindingName("y")], Var("x")))
  )
})
