import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse PiImplicit", () => {
  expect(parseExp("(implicit T: Type, x: T) -> Type")).toMatchObject(
    deleteUndefined(
      Exps.FoldedPi(
        [
          Exps.PiBindingImplicit("T", Exps.Var("Type")),
          Exps.PiBindingNamed("x", Exps.Var("T")),
        ],
        Exps.Var("Type"),
      ),
    ),
  )

  expect(parseExp("forall (implicit T: Type, x: T) Type")).toMatchObject(
    deleteUndefined(
      Exps.FoldedPi(
        [
          Exps.PiBindingImplicit("T", Exps.Var("Type")),
          Exps.PiBindingNamed("x", Exps.Var("T")),
        ],
        Exps.Var("Type"),
      ),
    ),
  )
})
