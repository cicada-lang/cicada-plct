import { expect, test } from "bun:test"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Fn -- with return type", () => {
  expect(parseExp("function (x: String): String { return x }")).toMatchObject(
    deleteUndefined(
      Exps.FnUnfoldedWithRetType(
        [Exps.FnBindingAnnotated("x", Exps.Var("String"))],
        Exps.Var("String"),
        Exps.SequenceUnfolded([], Exps.Var("x")),
      ),
    ),
  )
})
