import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("equivalent Pi", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

equivalent Type [
  forall (T: Type, x: T) T,
  forall (T: Type, y: T) T,
  forall (T: Type, y: T) id(Type, T),
  forall (T: Type, y: id(Type, T)) id(Type, T),
]

equivalent Type [
  forall (A: Type, x: A, B: Type, y: B) A,
  forall (B: Type, y: B, A: Type, x: A) B,
  forall (B: Type, y: id(Type, B), A: Type, x: id(Type, A)) id(Type, B),
]

`)
})

test("equivalent Pi -- fail", async () => {
  await expectCodeToFail(`

equivalent Type [
  forall (A: Type, x: A, B: Type, y: B) A,
  forall (A: Type, x: A, B: Type, y: B) B,
]

`)
})
