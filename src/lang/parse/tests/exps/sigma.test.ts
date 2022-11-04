import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Sigma", () => {
  expect(parseExp("exists (n: Nat) Nat")).toMatchObject(
    deleteUndefined(
      Exps.SigmaUnfolded(
        [Exps.SigmaBindingNamed("n", Exps.Var("Nat"))],
        Exps.Var("Nat"),
      ),
    ),
  )
})

test("parse Sigma -- multiple bindings", () => {
  expect(parseExp("exists (n: Nat, m: Nat) Nat")).toMatchObject(
    deleteUndefined(
      Exps.SigmaUnfolded(
        [
          Exps.SigmaBindingNamed("n", Exps.Var("Nat")),
          Exps.SigmaBindingNamed("m", Exps.Var("Nat")),
        ],
        Exps.Var("Nat"),
      ),
    ),
  )
})

test("parse Sigma -- nameless binding", () => {
  expect(parseExp("exists (Nat) Nat")).toMatchObject(
    deleteUndefined(
      Exps.SigmaUnfolded(
        [Exps.SigmaBindingNameless(Exps.Var("Nat"))],
        Exps.Var("Nat"),
      ),
    ),
  )
})
