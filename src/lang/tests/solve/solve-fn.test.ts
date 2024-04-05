import { expect, test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("solve Fn", async () => {
  await expectCodeToFail(`

solve (x: String) {
  (_: Trivial) => x = (_: Trivial) => "abc"
}

`)
})

test("solve Fn -- unintended", async () => {
  await expectCodeToFail(`

solve (x: String) {
  (_: String) => x = (y: String) => y
  (_: String) => x = (z: String) => z
}

`)
})

test("solve Fn -- alpha equivalence", async () => {
  const output = await runCode(`

solve () {
  (A: Type, a: A) => a = (B: Type, b: B) => b
}

`)

  expect(output).toMatchSnapshot()
})

test("solve Fn -- deepWalk", async () => {
  const output = await runCode(`

solve (T: Type, f: (Trivial) -> Type) {
  f = (_) => T
  T = String
}

`)

  expect(output).toMatchSnapshot()
})

test("solve Fn -- occur in fn", async () => {
  await expectCodeToFail(`

solve (x: (Type) -> Type) {
  x = (y: Type) => x(y)
}

`)
})

test("solve Fn -- occur shadowed by Fn", async () => {
  const output = await runCode(`

solve (x: (Type) -> Type) {
  x = (x: Type) => x
}

`)

  expect(output).toMatchSnapshot()
})
