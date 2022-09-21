import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Fn -- implicit", () => {
  expect(parseExp("(implicit x) => x")).toMatchObject(
    deleteUndefined(
      Exps.FnFolded([Exps.FnBindingImplicit("x")], Exps.Var("x")),
    ),
  )

  expect(parseExp("function (implicit T, y: T) { return T }")).toMatchObject(
    deleteUndefined(
      Exps.FnFolded(
        [
          Exps.FnBindingImplicit("T"),
          Exps.FnBindingAnnotated("y", Exps.Var("T")),
        ],
        Exps.SequenceFolded([], Exps.Var("T")),
      ),
    ),
  )
})
