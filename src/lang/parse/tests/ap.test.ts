import { expect, test } from "vitest"
import { parseExp } from "../index"
import { Var, MultiAp } from "../../Exp"
import { deleteUndefined } from "./utils"

test("parse ap", () => {
  expect(parseExp("f(x)")).toMatchObject(
    deleteUndefined(MultiAp(Var("f"), [{ kind: "plain", exp: Var("x") }]))
  )

  expect(parseExp("f(x, y)")).toMatchObject(
    deleteUndefined(
      MultiAp(Var("f"), [
        { kind: "plain", exp: Var("x") },
        { kind: "plain", exp: Var("y") },
      ])
    )
  )

  expect(parseExp("f(x)(y)")).toMatchObject(
    deleteUndefined(MultiAp(MultiAp(Var("f"), [{ kind: "plain", exp: Var("x") }]), [{ kind: "plain", exp: Var("y") }]))
  )
})
