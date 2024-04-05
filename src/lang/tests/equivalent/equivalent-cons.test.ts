import { expect, test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("equivalent Cons", async () => {
  const output = await runCode(`

function id(T: Type, x: T): T {
  return x
}

compute equivalent exists (T: Type) T {
    cons(Trivial, sole)
  = cons(Trivial, id(Trivial, sole))
}

`)

  expect(output).toMatchSnapshot()
})

test("equivalent Cons -- fail", async () => {
  await expectCodeToFail(`

compute equivalent exists (T: Type) T {
    cons(String, "abc")
  = cons(String, "xyz")
}

`)
})
