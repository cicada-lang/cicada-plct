import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Sole", async () => {
  const output = await runCode(`

solve () {
  equation sole = sole : Trivial
  equation sole = sole : Trivial
  equation sole = sole : Trivial
}

`)

  expect(output).toMatchInlineSnapshot('"{  }"')
})

test("solve Sole", async () => {
  const output = await runCode(`

solve (a: Trivial, b: Trivial, c: Trivial) {
  equation a = b : Trivial
  equation b = c : Trivial
  equation c = sole : Trivial
}

`)

  expect(output).toMatchInlineSnapshot('"{ a: sole, b: sole, c: sole }"')
})
