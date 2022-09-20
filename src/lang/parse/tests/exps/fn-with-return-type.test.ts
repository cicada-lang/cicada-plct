import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Fn -- with return type", () => {
  expect(parseExp("function (x: String): String { return x }")).toMatchObject(
    deleteUndefined(
      Exps.FnFoldedWithRetType(
        [Exps.FnBindingAnnotated("x", Exps.Var("String"))],
        Exps.Var("String"),
        Exps.FoldedSequence([], Exps.Var("x")),
      ),
    ),
  )
})
