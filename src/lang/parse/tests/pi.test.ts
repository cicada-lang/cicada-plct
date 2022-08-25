import { expect, test } from "vitest"
import { parseExp } from "../index"
import { Var, Pi } from "../../Exp"
import { deleteUndefined } from "./utils"

test("parse Pi", () => {
  expect(parseExp("(n: Nat) -> Nat")).toMatchObject(
    deleteUndefined(Pi("n", Var("Nat"), Var("Nat")))
  )

  expect(parseExp("forall (n: Nat) Nat")).toMatchObject(
    deleteUndefined(Pi("n", Var("Nat"), Var("Nat")))
  )

  expect(parseExp("(T: Type, x: T) -> T")).toMatchObject(
    deleteUndefined(Pi("T", Var("Type"), Pi("x", Var("T"), Var("T"))))
  )

  expect(parseExp("forall (T: Type, x: T) T")).toMatchObject(
    deleteUndefined(Pi("T", Var("Type"), Pi("x", Var("T"), Var("T"))))
  )
})

test("parse Pi nameless", () => {
  expect(parseExp("(Nat) -> Nat")).toMatchObject(
    deleteUndefined(Pi("_", Var("Nat"), Var("Nat")))
  )

  expect(parseExp("forall (Nat) Nat")).toMatchObject(
    deleteUndefined(Pi("_", Var("Nat"), Var("Nat")))
  )
})
