import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Pair", async () => {
  const output = await runCode(`

compute Pair(Type, Type)

`)

  expect(output).toMatchInlineSnapshot('"Pair(Type, Type): Type"')
})
