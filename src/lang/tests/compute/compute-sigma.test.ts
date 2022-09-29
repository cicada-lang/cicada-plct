import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Sigma", async () => {
  const output = await runCode(`

compute exists (Type) Type

`)

  expect(output).toMatchInlineSnapshot('"Pair(Type, Type): Type"')
})
