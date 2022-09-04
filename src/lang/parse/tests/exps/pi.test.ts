import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Pi", () => {
  expect(parseExp("(n: Nat) -> Nat")).toMatchObject(
    deleteUndefined(
      Exps.FoldedPi(
        [Exps.PiBindingNamed("n", Exps.Var("Nat"))],
        Exps.Var("Nat"),
      ),
    ),
  )

  expect(parseExp("forall (n: Nat) Nat")).toMatchObject(
    deleteUndefined(
      Exps.FoldedPi(
        [Exps.PiBindingNamed("n", Exps.Var("Nat"))],
        Exps.Var("Nat"),
      ),
    ),
  )
})

test("parse Pi -- multiple bindings", () => {
  expect(parseExp("(T: Type, x: T) -> T")).toMatchObject(
    deleteUndefined(
      Exps.FoldedPi(
        [
          Exps.PiBindingNamed("T", Exps.Var("Type")),
          Exps.PiBindingNamed("x", Exps.Var("T")),
        ],
        Exps.Var("T"),
      ),
    ),
  )

  expect(parseExp("forall (T: Type, x: T) T")).toMatchObject(
    deleteUndefined(
      Exps.FoldedPi(
        [
          Exps.PiBindingNamed("T", Exps.Var("Type")),
          Exps.PiBindingNamed("x", Exps.Var("T")),
        ],
        Exps.Var("T"),
      ),
    ),
  )
})

test("parse Pi -- nameless binding", () => {
  expect(parseExp("(Nat) -> Nat")).toMatchObject(
    deleteUndefined(
      Exps.FoldedPi([Exps.PiBindingNameless(Exps.Var("Nat"))], Exps.Var("Nat")),
    ),
  )

  expect(parseExp("forall (Nat) Nat")).toMatchObject(
    deleteUndefined(
      Exps.FoldedPi([Exps.PiBindingNameless(Exps.Var("Nat"))], Exps.Var("Nat")),
    ),
  )
})
