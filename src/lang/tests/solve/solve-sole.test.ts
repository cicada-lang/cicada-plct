import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Sole", async () => {
  const output = await runCode(`

solve () {
  equation sole = sole
  equation sole = sole
  equation sole = sole
}

`)

  expect(output).toMatchInlineSnapshot('"{  }"')
})

test("solve Sole", async () => {
  const output = await runCode(`

solve (a: Trivial, b: Trivial, c: Trivial) {
  equation a = b
  equation b = c
  equation c = sole
}

`)

  expect(output).toMatchInlineSnapshot('"{ a: sole, b: sole, c: sole }"')
})
