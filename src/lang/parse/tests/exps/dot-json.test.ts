import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Dot", () => {
  expect(parseExp('object["Hello, World!"]')).toMatchObject(
    deleteUndefined(Exps.Dot(Exps.Var("object"), "Hello, World!")),
  )

  expect(parseExp('object["Hello, World!"](x, y)')).toMatchObject(
    deleteUndefined(
      Exps.FoldedAp(Exps.Dot(Exps.Var("object"), "Hello, World!"), [
        Exps.ArgPlain(Exps.Var("x")),
        Exps.ArgPlain(Exps.Var("y")),
      ]),
    ),
  )

  expect(parseExp('object["Hello, World!"](x)(y)')).toMatchObject(
    deleteUndefined(
      Exps.FoldedAp(
        Exps.FoldedAp(Exps.Dot(Exps.Var("object"), "Hello, World!"), [
          Exps.ArgPlain(Exps.Var("x")),
        ]),
        [Exps.ArgPlain(Exps.Var("y"))],
      ),
    ),
  )
})
