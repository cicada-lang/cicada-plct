import { expect, test } from "vitest"
import * as Exps from "../../../exp/index.js"
import { parseExp } from "../../index.js"
import { deleteUndefined } from "../utils.js"

test("parse Fn", () => {
  expect(parseExp("(x) => x")).toMatchObject(
    deleteUndefined(Exps.FnUnfolded([Exps.FnBindingName("x")], Exps.Var("x"))),
  )

  expect(parseExp("function (x) { return x }")).toMatchObject(
    deleteUndefined(
      Exps.FnUnfolded(
        [Exps.FnBindingName("x")],
        Exps.SequenceUnfolded([], Exps.Var("x")),
      ),
    ),
  )
})

test("parse Fn -- multiple bindings", () => {
  expect(parseExp("(x, y) => x")).toMatchObject(
    deleteUndefined(
      Exps.FnUnfolded(
        [Exps.FnBindingName("x"), Exps.FnBindingName("y")],
        Exps.Var("x"),
      ),
    ),
  )

  expect(parseExp("function (x, y) { return x }")).toMatchObject(
    deleteUndefined(
      Exps.FnUnfolded(
        [Exps.FnBindingName("x"), Exps.FnBindingName("y")],
        Exps.SequenceUnfolded([], Exps.Var("x")),
      ),
    ),
  )
})
