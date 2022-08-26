import { expect, test } from "vitest"
import { Ap, ArgPlain, Var } from "../../../Exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Ap", () => {
  expect(parseExp("f(x)")).toMatchObject(
    deleteUndefined(Ap(Var("f"), [ArgPlain(Var("x"))]))
  )

  expect(parseExp("f(x, y)")).toMatchObject(
    deleteUndefined(Ap(Var("f"), [ArgPlain(Var("x")), ArgPlain(Var("y"))]))
  )

  expect(parseExp("f(x)(y)")).toMatchObject(
    deleteUndefined(
      Ap(Ap(Var("f"), [ArgPlain(Var("x"))]), [ArgPlain(Var("y"))])
    )
  )
})
