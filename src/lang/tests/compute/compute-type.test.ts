import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Type", async () => {
  const output = await runCode(`

compute Type

`)

  expect(output).toMatchInlineSnapshot('"Type: Type"')
})
