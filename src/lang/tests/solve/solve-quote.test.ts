import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Quote -- data", async () => {
  const output = await runCode(`

solve () {
  unify "a" = "a"
  unify "b" = "b"
  unify "c" = "c"
}

`)

  expect(output).toMatchInlineSnapshot('"{  }"')
})

test("solve Quote -- bindings", async () => {
  const output = await runCode(`

solve (a: String, b: String, c: String) {
  unify a = "a"
  unify b = "b"
  unify c = "c"
}

`)

  expect(output).toMatchInlineSnapshot('"{ a: \\"a\\", b: \\"b\\", c: \\"c\\" }"')
})

test("solve Quote -- walk", async () => {
  const output = await runCode(`

solve (a: String, b: String, c: String) {
  unify a = b
  unify b = c
  unify a = "a"
}

`)

  expect(output).toMatchInlineSnapshot('"{ a: \\"a\\", b: \\"a\\", c: \\"a\\" }"')
})
