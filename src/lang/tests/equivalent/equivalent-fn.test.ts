import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("equivalent Fn", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

equivalent forall (T: Type, x: T) T [
  id,
  (T, x) => x,
  (T, x) => id(T, x),
]

equivalent forall (A: Type, B: Type) Type [
  (A, B) => A,
  (B, A) => B,
]

`)
})

test("equivalent FnAnnotated", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

equivalent forall (T: Type, x: T) T [
  id,
  (T, x) => x,
  (T, x) => id(T, x),
  (T: Type, x: T) => x,
  (T: Type, x: T) => id(T, x),
]

equivalent forall (T: Type, x: T) T [
  (T: Type, x: T) => x,
  (T: Type, x: T) => x,
  (T: Type, x: T) => id(T, x),
]

`)
})

test("equivalent Fn -- fail", async () => {
  await expectCodeToFail(`

equivalent forall (A: Type, B: Type) Type [
  (A, B) => A,
  (A, B) => B,
]

`)
})
