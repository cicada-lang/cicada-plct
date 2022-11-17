import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Fn -- annotated", () => {
  expect(parseExp("(x: Type, y: Type) => x")).toMatchObject(
    deleteUndefined(
      Exps.FnUnfolded(
        [
          Exps.FnBindingAnnotated("x", Exps.Var("Type")),
          Exps.FnBindingAnnotated("y", Exps.Var("Type")),
        ],
        Exps.Var("x"),
      ),
    ),
  )

  expect(parseExp("(x: Type, y) => x")).toMatchObject(
    deleteUndefined(
      Exps.FnUnfolded(
        [
          Exps.FnBindingAnnotated("x", Exps.Var("Type")),
          Exps.FnBindingName("y"),
        ],
        Exps.Var("x"),
      ),
    ),
  )
})
