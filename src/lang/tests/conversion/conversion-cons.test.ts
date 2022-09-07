import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("conversion Cons", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

conversion exists (T: Type) T [
  cons(Trivial, sole),
  cons(Trivial, id(Trivial, sole)),
]

`)
})

test("conversion Cons -- fail", async () => {
  await expectCodeToFail(`

conversion exists (T: Type) T [
  cons(String, "abc"),
  cons(String, "xyz"),
]

`)
})
