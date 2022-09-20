import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Fn", () => {
  expect(parseExp("(x) => x")).toMatchObject(
    deleteUndefined(Exps.FnFolded([Exps.FnBindingName("x")], Exps.Var("x"))),
  )

  expect(parseExp("function (x) { return x }")).toMatchObject(
    deleteUndefined(
      Exps.FnFolded(
        [Exps.FnBindingName("x")],
        Exps.FoldedSequence([], Exps.Var("x")),
      ),
    ),
  )
})

test("parse Fn -- multiple bindings", () => {
  expect(parseExp("(x, y) => x")).toMatchObject(
    deleteUndefined(
      Exps.FnFolded(
        [Exps.FnBindingName("x"), Exps.FnBindingName("y")],
        Exps.Var("x"),
      ),
    ),
  )

  expect(parseExp("function (x, y) { return x }")).toMatchObject(
    deleteUndefined(
      Exps.FnFolded(
        [Exps.FnBindingName("x"), Exps.FnBindingName("y")],
        Exps.FoldedSequence([], Exps.Var("x")),
      ),
    ),
  )
})
