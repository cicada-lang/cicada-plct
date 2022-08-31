import { expect, test } from "vitest"
import { runCode } from "./utils"

test("check String is Type", async () => {
  const output = await runCode(`

compute String

`)

  expect(output).toMatchInlineSnapshot()
})
