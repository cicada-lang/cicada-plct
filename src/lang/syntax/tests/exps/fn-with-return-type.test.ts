import { expect, test } from "vitest"
import * as Exps from "../../../exp/index.js"
import { parseExp } from "../../index.js"
import { deleteUndefined } from "../utils.js"

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
