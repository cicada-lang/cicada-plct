import { expect, test } from "vitest"
import * as Exps from "../../../exp/index.js"
import { parseExp } from "../../index.js"
import { deleteUndefined } from "../utils.js"

test("parse Objekt -- spread", () => {
  expect(parseExp("{ a, ...b }")).toMatchObject(
    deleteUndefined(
      Exps.ObjektUnfolded([
        Exps.PropertyPlain("a", Exps.Var("a")),
        Exps.PropertySpread(Exps.Var("b")),
      ]),
    ),
  )

  expect(parseExp("{ a, ...f(b) }")).toMatchObject(
    deleteUndefined(
      Exps.ObjektUnfolded([
        Exps.PropertyPlain("a", Exps.Var("a")),
        Exps.PropertySpread(
          Exps.ApUnfolded(Exps.Var("f"), [Exps.ArgPlain(Exps.Var("b"))]),
        ),
      ]),
    ),
  )
})
