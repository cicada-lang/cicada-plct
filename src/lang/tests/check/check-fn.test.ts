import { test } from "vitest"
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

check (a) => a: (A: Type) -> A

`)
})
