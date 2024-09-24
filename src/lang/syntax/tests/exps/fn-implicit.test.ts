import { expect, test } from "vitest"
import * as Exps from "../../../exp/index.js"
import { parseExp } from "../../index.js"
import { deleteUndefined } from "../utils.js"

test("parse Fn -- implicit", () => {
  expect(parseExp("(implicit x) => x")).toMatchObject(
    deleteUndefined(
      Exps.FnUnfolded([Exps.FnBindingImplicit("x")], Exps.Var("x")),
    ),
  )

  expect(parseExp("function (implicit T, y: T) { return T }")).toMatchObject(
    deleteUndefined(
      Exps.FnUnfolded(
        [
          Exps.FnBindingImplicit("T"),
          Exps.FnBindingAnnotated("y", Exps.Var("T")),
        ],
        Exps.SequenceUnfolded([], Exps.Var("T")),
      ),
    ),
  )
})
