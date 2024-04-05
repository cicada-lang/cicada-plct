import { test } from "bun:test"
import { expectCodeToFail, runCode } from "../utils"

test("check Fn", async () => {
  await runCode(`

check (T) => T: (Type) -> Type

`)
})

test("check Fn -- multiple bindings", async () => {
  await runCode(`

check (A, B) => A: (A: Type, B: Type) -> Type

`)
})

test("check Fn -- dependent", async () => {
  await runCode(`

check (A, a) => a: (A: Type, A) -> A

`)
})

test("check Fn -- dependent error", async () => {
  await expectCodeToFail(`

check (A) => A: (A: Type) -> A

`)
})

test("check Fn -- readback and scope", async () => {
  /**
     In the scope of `f` body,
     `U` will be `readback` to `Cores.Var("Type")`,
     `Type` will also be `readback` to `Cores.Var("Type")`,
     but they should not be equal.
  **/

  await expectCodeToFail(`

let U = Type

function f(Type: (Type) -> Type) {
  return Equal(U, Type, U)
}

`)
})
