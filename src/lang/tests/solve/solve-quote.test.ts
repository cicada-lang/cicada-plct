import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Quote -- literal", async () => {
  const output = await runCode(`

solve () {
  equation "a" = "a" : String
  equation "b" = "b" : String
  equation "c" = "c" : String
}

`)

  expect(output).toMatchInlineSnapshot('"{  }"')
})

test("solve Quote -- bindings", async () => {
  const output = await runCode(`

solve (a: String, b: String, c: String) {
  equation a = "a" : String
  equation b = "b" : String
  equation c = "c" : String
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ a: \\"a\\", b: \\"b\\", c: \\"c\\" }"',
  )
})

test("solve Quote -- walk", async () => {
  const output = await runCode(`

solve (a: String, b: String, c: String) {
  equation a = b : String
  equation b = c : String
  equation a = "a" : String
}

`)

  expect(output).toMatchInlineSnapshot('"{ a: b, b: c, c: \\"a\\" }"')
})
