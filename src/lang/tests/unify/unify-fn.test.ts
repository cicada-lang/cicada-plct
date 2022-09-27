import { expect, test } from "vitest"
import { runCode } from "../utils"

test("unify Fn", async () => {
  const output = await runCode(`

unify (x: String) {
  equation (_: Trivial) => x = (_: Trivial) => "abc"
}

`)

  expect(output).toMatchInlineSnapshot('"{ x: \\"abc\\" }"')
})

test("unify Fn -- alpha equivalence", async () => {
  const output = await runCode(`

unify () {
  equation (A: Type, a: A) => a = (B: Type, b: B) => b
}

`)

  expect(output).toMatchInlineSnapshot('"{  }"')
})
