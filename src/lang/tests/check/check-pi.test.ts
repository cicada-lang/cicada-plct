import { test } from "vitest"
import { runCode } from "../utils.js"

test("check Pi is a Type", async () => {
  await runCode(`

check (A: Type) -> Type: Type

`)
})

test("check Pi is a Type -- multiple bindings", async () => {
  await runCode(`

check (A: Type, B: Type) -> Type: Type

`)
})

test("check Pi is a Type -- telescope", async () => {
  await runCode(`

check (A: Type, B: Type, x: A) -> B: Type

`)
})

test("check Pi is a Type -- nested", async () => {
  await runCode(`

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
