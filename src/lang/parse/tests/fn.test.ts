import { expect, test } from "vitest"
import { Fn, Var } from "../../Exp"
import { parseExp } from "../index"
import { deleteUndefined } from "./utils"

test("parse Fn", () => {
  expect(parseExp("(x) => x")).toMatchObject(deleteUndefined(Fn("x", Var("x"))))

  expect(parseExp("function (x) x")).toMatchObject(
    deleteUndefined(Fn("x", Var("x")))
  )

  expect(parseExp("(x, y) => x")).toMatchObject(
    deleteUndefined(Fn("x", Fn("y", Var("x"))))
  )

  expect(parseExp("function (x, y) x")).toMatchObject(
    deleteUndefined(Fn("x", Fn("y", Var("x"))))
  )
})
