import { expect, test } from "vitest"
import { runCode } from "../utils"

test("unify String", async () => {
  const output = await runCode(`

unify () {
  equation String = String
}

`)

  expect(output).toMatchInlineSnapshot('"{  }"')
})
