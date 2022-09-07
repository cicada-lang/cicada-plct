import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("conversion Fn", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

conversion forall (T: Type, x: T) T [
  id,
  (T, x) => x,
  (T, x) => id(T, x),
]

conversion forall (A: Type, B: Type) Type [
  (A, B) => A,
  (B, A) => B,
]

`)
})

test.todo("conversion AnnotatedFn", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

conversion forall (T: Type, x: T) T [
  id,
  (T, x) => x,
  (T, x) => id(T, x),
  (T: Type, x: T) => x,
  (T: Type, x: T) => id(T, x),
]

conversion forall (T: Type, x: T) T [
  (T: Type, x: T) => x,
  (T: Type, x: T) => x,
  (T: Type, x: T) => id(T, x),
]

`)
})

test("conversion Fn -- fail", async () => {
  await expectCodeToFail(`

conversion forall (A: Type, B: Type) Type [
  (A, B) => A,
  (A, B) => B,
]

`)
})
