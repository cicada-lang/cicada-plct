import { expect, test } from "vitest"
import { ArgPlain, Dot, FoldedAp, Var } from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Dot", () => {
  expect(parseExp("object.x")).toMatchObject(
    deleteUndefined(Dot(Var("object"), "x")),
  )

  expect(parseExp("object.f(x, y)")).toMatchObject(
    deleteUndefined(
      FoldedAp(Dot(Var("object"), "f"), [
        ArgPlain(Var("x")),
        ArgPlain(Var("y")),
      ]),
    ),
  )

  expect(parseExp("object.f(x)(y)")).toMatchObject(
    deleteUndefined(
      FoldedAp(FoldedAp(Dot(Var("object"), "f"), [ArgPlain(Var("x"))]), [
        ArgPlain(Var("y")),
      ]),
    ),
  )
})
