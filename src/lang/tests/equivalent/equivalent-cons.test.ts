import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("equivalent Cons", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

equivalent exists (T: Type) T [
  cons(Trivial, sole),
  cons(Trivial, id(Trivial, sole)),
]

`)
})

test("equivalent Cons -- fail", async () => {
  await expectCodeToFail(`

equivalent exists (T: Type) T [
  cons(String, "abc"),
  cons(String, "xyz"),
]

`)
})
