import { expect, test } from "vitest"
import { runCode } from "./utils"

test("compute quote", async () => {
  const output = await runCode(`

compute "abc"

`)

  expect(output).toMatchInlineSnapshot('"\\"abc\\": String"')
})
