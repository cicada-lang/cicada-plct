import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Fn", async () => {
  const output = await runCode(`

solve (x: String) {
  unify (_: Trivial) => x = (_: Trivial) => "abc"
}

`)

  expect(output).toMatchInlineSnapshot('"{ x: \\"abc\\" }"')
})

test("solve Fn -- alpha equivalence", async () => {
  const output = await runCode(`

solve () {
  unify (A: Type, a: A) => a = (B: Type, b: B) => b
}

`)

  expect(output).toMatchInlineSnapshot('"{  }"')
})

test("solve Fn -- deepWalk", async () => {
  const output = await runCode(`

solve (T: Type, f: (Trivial) -> Type) {
  unify f = (_) => T : (Trivial) -> Type
  unify T = String
}

`)

  expect(output).toMatchInlineSnapshot('"{ T: String, f: (_2) => T }"')
})
