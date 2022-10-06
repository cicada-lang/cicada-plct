import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Equal", async () => {
  const output = await runCode(`

compute Equal
compute Equal(String)
compute Equal(String, "abc")
compute Equal(String, "abc", "123")

`)

  expect(output).toMatchInlineSnapshot(`
    "(T, from, to) => Equal(T, from, to): (T: Type, T, T) -> Type
    (from, to) => Equal(String, from, to): (String, String) -> Type
    (to) => Equal(String, \\"abc\\", to): (String) -> Type
    Equal(String, \\"abc\\", \\"123\\"): Type"
  `)
})
