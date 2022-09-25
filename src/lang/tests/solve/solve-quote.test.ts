import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Quote -- data", async () => {
  const output = await runCode(`

solve () {
  equation "a" = "a"
  equation "b" = "b"
  equation "c" = "c"
}

`)

  expect(output).toMatchInlineSnapshot('"{  }"')
})

test("solve Quote -- bindings", async () => {
  const output = await runCode(`

solve (a: String, b: String, c: String) {
  equation a = "a"
  equation b = "b"
  equation c = "c"
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ a: \\"a\\", b: \\"b\\", c: \\"c\\" }"',
  )
})

test("solve Quote -- walk", async () => {
  const output = await runCode(`

solve (a: String, b: String, c: String) {
  equation a = b
  equation b = c
  equation a = "a"
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ a: \\"a\\", b: \\"a\\", c: \\"a\\" }"',
  )
})
