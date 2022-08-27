import { expect, test } from "vitest"
import { MultiPi, PiBindingNamed, PiBindingNameless, Var } from "../../../Exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Pi", () => {
  expect(parseExp("(n: Nat) -> Nat")).toMatchObject(
    deleteUndefined(MultiPi([PiBindingNamed("n", Var("Nat"))], Var("Nat")))
  )

  expect(parseExp("forall (n: Nat) Nat")).toMatchObject(
    deleteUndefined(MultiPi([PiBindingNamed("n", Var("Nat"))], Var("Nat")))
  )
})

test("parse Pi -- multiple bindings", () => {
  expect(parseExp("(T: Type, x: T) -> T")).toMatchObject(
    deleteUndefined(
      MultiPi(
        [PiBindingNamed("T", Var("Type")), PiBindingNamed("x", Var("T"))],
        Var("T")
      )
    )
  )

  expect(parseExp("forall (T: Type, x: T) T")).toMatchObject(
    deleteUndefined(
      MultiPi(
        [PiBindingNamed("T", Var("Type")), PiBindingNamed("x", Var("T"))],
        Var("T")
      )
    )
  )
})

test("parse Pi -- nameless binding", () => {
  expect(parseExp("(Nat) -> Nat")).toMatchObject(
    deleteUndefined(MultiPi([PiBindingNameless(Var("Nat"))], Var("Nat")))
  )

  expect(parseExp("forall (Nat) Nat")).toMatchObject(
    deleteUndefined(MultiPi([PiBindingNameless(Var("Nat"))], Var("Nat")))
  )
})
