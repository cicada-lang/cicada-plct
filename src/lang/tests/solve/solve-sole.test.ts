import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Sole", async () => {
  const output = await runCode(`

solve () {
  unify sole = sole
  unify sole = sole
  unify sole = sole
}

`)

  expect(output).toMatchInlineSnapshot('"{  }"')
})

test("solve Sole", async () => {
  const output = await runCode(`

solve (a: Trivial, b: Trivial, c: Trivial) {
  unify a = b
  unify b = c
  unify c = sole
}

`)

  expect(output).toMatchInlineSnapshot('"{ a: sole, b: sole, c: sole }"')
})
