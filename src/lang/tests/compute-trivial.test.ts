import { expect, test } from "vitest"
import { runCode } from "./utils"

test("compute Trivial", async () => {
  const output = await runCode(`

compute Trivial

`)

  expect(output).toMatchInlineSnapshot('"Trivial: Type"')
})
