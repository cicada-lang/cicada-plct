import { test } from "vitest"
import { expectCodeToFail, expectCodeToRun } from "./utils"

test("check Fn", async () => {
  await expectCodeToRun(`

check (T) => T: (Type) -> Type

`)
})

test("check Fn -- multiple bindings", async () => {
  await expectCodeToRun(`

check (A, B) => A: (A: Type, B: Type) -> Type

`)
})

test("check Fn -- dependent", async () => {
  await expectCodeToRun(`

check (A, a) => a: (A: Type, A) -> A

`)
})

test("check Fn -- dependent error", async () => {
  await expectCodeToFail(`

check (A, B) => A: (A: Type, A) -> A

`)
})
