import { expect, test } from "vitest"
import { ArgPlain, MultiAp, Var } from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Ap", () => {
  expect(parseExp("f(x)")).toMatchObject(
    deleteUndefined(MultiAp(Var("f"), [ArgPlain(Var("x"))]))
  )

  expect(parseExp("f(x, y)")).toMatchObject(
    deleteUndefined(MultiAp(Var("f"), [ArgPlain(Var("x")), ArgPlain(Var("y"))]))
  )

  expect(parseExp("f(x)(y)")).toMatchObject(
    deleteUndefined(
      MultiAp(MultiAp(Var("f"), [ArgPlain(Var("x"))]), [ArgPlain(Var("y"))])
    )
  )
})
