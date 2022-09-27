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
