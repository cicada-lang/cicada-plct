import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute String", async () => {
  const output = await runCode(`

compute String

`)

  expect(output).toMatchInlineSnapshot('"String: Type"')
})
