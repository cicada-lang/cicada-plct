import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Objekt -- spread", () => {
  expect(parseExp("{ a, ...b }")).toMatchObject(
    deleteUndefined(
      Exps.FoldedObjekt([
        Exps.PropertyPlain("a", Exps.Var("a")),
        Exps.PropertySpread(Exps.Var("b")),
      ]),
    ),
  )

  expect(parseExp("{ a, ...f(b) }")).toMatchObject(
    deleteUndefined(
      Exps.FoldedObjekt([
        Exps.PropertyPlain("a", Exps.Var("a")),
        Exps.PropertySpread(
          Exps.FoldedAp(Exps.Var("f"), [Exps.ArgPlain(Exps.Var("b"))]),
        ),
      ]),
    ),
  )
})
