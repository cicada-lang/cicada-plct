import { expect, test } from "vitest"
import { Sigma, Var } from "../../../Exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Sigma", () => {
  expect(parseExp("exists (n: Nat) Nat")).toMatchObject(
    deleteUndefined(Sigma("n", Var("Nat"), Var("Nat")))
  )
})
