import { test } from "vitest"
import { expectCodeToRun } from "./utils"

test("check Pi is a Type", async () => {
  await expectCodeToRun(`

check (A: Type) -> Type: Type

`)
})

test("check Pi is a Type -- multiple bindings", async () => {
  await expectCodeToRun(`

check (A: Type, B: Type) -> Type: Type

`)
})

test("check Pi is a Type -- telescope", async () => {
  await expectCodeToRun(`

check (A: Type, B: Type, x: A) -> B: Type

`)
})

test("check Pi is a Type -- nested", async () => {
  await expectCodeToRun(`

check (
  A: Type,
  F: (A: Type) -> Type,
) -> Type: Type

check (
  F: (A: Type) -> Type,
  G: (A: Type, B: Type) -> Type,
) -> Type: Type

`)
})
