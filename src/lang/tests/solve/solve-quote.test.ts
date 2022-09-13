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
