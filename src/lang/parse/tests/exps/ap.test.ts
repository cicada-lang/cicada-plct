import { expect, test } from "vitest"
import { ArgPlain, FoldedAp, Var } from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Ap", () => {
  expect(parseExp("f(x)")).toMatchObject(
    deleteUndefined(FoldedAp(Var("f"), [ArgPlain(Var("x"))]))
  )

  expect(parseExp("f(x, y)")).toMatchObject(
    deleteUndefined(
      FoldedAp(Var("f"), [ArgPlain(Var("x")), ArgPlain(Var("y"))])
    )
  )

  expect(parseExp("f(x)(y)")).toMatchObject(
    deleteUndefined(
      FoldedAp(FoldedAp(Var("f"), [ArgPlain(Var("x"))]), [ArgPlain(Var("y"))])
    )
  )
})
