import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute sigma", async () => {
  const output = await runCode(`

compute exists (Type) Type

`)

  expect(output).toMatchInlineSnapshot('"exists (Type) Type: Type"')
})
