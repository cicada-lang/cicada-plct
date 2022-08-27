import { expect, test } from "vitest"
import { Pi, PiBindingNamed, PiBindingNameless, Var } from "../../../Exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Pi", () => {
  expect(parseExp("(n: Nat) -> Nat")).toMatchObject(
    deleteUndefined(Pi([PiBindingNamed("n", Var("Nat"))], Var("Nat")))
  )

  expect(parseExp("forall (n: Nat) Nat")).toMatchObject(
    deleteUndefined(Pi([PiBindingNamed("n", Var("Nat"))], Var("Nat")))
  )
})

test("parse Pi -- multiple typings", () => {
  expect(parseExp("(T: Type, x: T) -> T")).toMatchObject(
    deleteUndefined(
      Pi(
        [PiBindingNamed("T", Var("Type")), PiBindingNamed("x", Var("T"))],
        Var("T")
      )
    )
  )

  expect(parseExp("forall (T: Type, x: T) T")).toMatchObject(
    deleteUndefined(
      Pi(
        [PiBindingNamed("T", Var("Type")), PiBindingNamed("x", Var("T"))],
        Var("T")
      )
    )
  )
})

test("parse Pi -- nameless typing", () => {
  expect(parseExp("(Nat) -> Nat")).toMatchObject(
    deleteUndefined(Pi([PiBindingNameless(Var("Nat"))], Var("Nat")))
  )

  expect(parseExp("forall (Nat) Nat")).toMatchObject(
    deleteUndefined(Pi([PiBindingNameless(Var("Nat"))], Var("Nat")))
  )
})
