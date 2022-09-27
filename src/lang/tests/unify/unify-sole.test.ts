import { expect, test } from "vitest"
import { runCode } from "../utils"

test("unify Sole", async () => {
  const output = await runCode(`

unify () {
  equation sole = sole
  equation sole = sole
  equation sole = sole
}

`)

  expect(output).toMatchInlineSnapshot('"{  }"')
})

test("unify Sole", async () => {
  const output = await runCode(`

unify (a: Trivial, b: Trivial, c: Trivial) {
  equation a = b
  equation b = c
  equation c = sole
}

`)

  expect(output).toMatchInlineSnapshot('"{ a: sole, b: sole, c: sole }"')
})
