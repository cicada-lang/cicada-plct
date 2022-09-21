import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Dot", () => {
  expect(parseExp("object.x")).toMatchObject(
    deleteUndefined(Exps.Dot(Exps.Var("object"), "x")),
  )

  expect(parseExp("object.f(x, y)")).toMatchObject(
    deleteUndefined(
      Exps.ApFolded(Exps.Dot(Exps.Var("object"), "f"), [
        Exps.ArgPlain(Exps.Var("x")),
        Exps.ArgPlain(Exps.Var("y")),
      ]),
    ),
  )

  expect(parseExp("object.f(x)(y)")).toMatchObject(
    deleteUndefined(
      Exps.ApFolded(
        Exps.ApFolded(Exps.Dot(Exps.Var("object"), "f"), [
          Exps.ArgPlain(Exps.Var("x")),
        ]),
        [Exps.ArgPlain(Exps.Var("y"))],
      ),
    ),
  )
})
