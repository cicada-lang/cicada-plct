import { expect, test } from "vitest"
import { runCode } from "../utils"

test("unify Type", async () => {
  const output = await runCode(`

unify () {
  equation Type = Type
}

`)

  expect(output).toMatchInlineSnapshot('"{  }"')
})
