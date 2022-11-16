import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Sole", async () => {
  const output = await runCode(`

solve () {
  sole = sole
  sole = sole
  sole = sole
}

`)

  expect(output).toMatchInlineSnapshot('"{}"')
})

test("solve Sole -- abc", async () => {
  const output = await runCode(`

solve (a: Trivial, b: Trivial, c: Trivial) {
  a = b
  b = c
  c = sole
}

`)

  expect(output).toMatchInlineSnapshot(`
    "{
      a: sole,
      b: sole,
      c: sole
    }"
  `)
})
