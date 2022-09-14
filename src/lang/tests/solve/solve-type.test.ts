import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Type", async () => {
  const output = await runCode(`

solve () {
  equation Type = Type
}

`)

  expect(output).toMatchInlineSnapshot('"{  }"')
})
