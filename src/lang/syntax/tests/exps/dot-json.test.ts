import { expect, test } from "bun:test"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Dot", () => {
  expect(parseExp('object["Hello, World!"]')).toMatchObject(
    deleteUndefined(Exps.Dot(Exps.Var("object"), "Hello, World!")),
  )

  expect(parseExp('object["Hello, World!"](x, y)')).toMatchObject(
    deleteUndefined(
      Exps.ApUnfolded(Exps.Dot(Exps.Var("object"), "Hello, World!"), [
        Exps.ArgPlain(Exps.Var("x")),
        Exps.ArgPlain(Exps.Var("y")),
      ]),
    ),
  )

  expect(parseExp('object["Hello, World!"](x)(y)')).toMatchObject(
    deleteUndefined(
      Exps.ApUnfolded(
        Exps.ApUnfolded(Exps.Dot(Exps.Var("object"), "Hello, World!"), [
          Exps.ArgPlain(Exps.Var("x")),
        ]),
        [Exps.ArgPlain(Exps.Var("y"))],
      ),
    ),
  )
})
