import { expect, test } from "vitest"
import * as Exps from "../../../exp/index.js"
import { parseExp } from "../../index.js"
import { deleteUndefined } from "../utils.js"

test("parse Ap", () => {
  expect(parseExp("f(x)")).toMatchObject(
    deleteUndefined(
      Exps.ApUnfolded(Exps.Var("f"), [Exps.ArgPlain(Exps.Var("x"))]),
    ),
  )

  expect(parseExp("f(x, y)")).toMatchObject(
    deleteUndefined(
      Exps.ApUnfolded(Exps.Var("f"), [
        Exps.ArgPlain(Exps.Var("x")),
        Exps.ArgPlain(Exps.Var("y")),
      ]),
    ),
  )

  expect(parseExp("f(x)(y)")).toMatchObject(
    deleteUndefined(
      Exps.ApUnfolded(
        Exps.ApUnfolded(Exps.Var("f"), [Exps.ArgPlain(Exps.Var("x"))]),
        [Exps.ArgPlain(Exps.Var("y"))],
      ),
    ),
  )
})
