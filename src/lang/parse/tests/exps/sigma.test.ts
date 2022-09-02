import { expect, test } from "vitest"
import {
  FoldedSigma,
  SigmaBindingNamed,
  SigmaBindingNameless,
  Var,
} from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Sigma", () => {
  expect(parseExp("exists (n: Nat) Nat")).toMatchObject(
    deleteUndefined(
      FoldedSigma([SigmaBindingNamed("n", Var("Nat"))], Var("Nat"))
    )
  )
})

test("parse Sigma -- multiple bindings", () => {
  expect(parseExp("exists (n: Nat, m: Nat) Nat")).toMatchObject(
    deleteUndefined(
      FoldedSigma(
        [
          SigmaBindingNamed("n", Var("Nat")),
          SigmaBindingNamed("m", Var("Nat")),
        ],
        Var("Nat")
      )
    )
  )
})

test("parse Sigma -- nameless binding", () => {
  expect(parseExp("exists (Nat) Nat")).toMatchObject(
    deleteUndefined(FoldedSigma([SigmaBindingNameless(Var("Nat"))], Var("Nat")))
  )
})
