import { expect, test } from "vitest"
import { runCode } from "../utils"

test("unify Trivial", async () => {
  const output = await runCode(`

unify () {
  equation Trivial = Trivial
}

`)

  expect(output).toMatchInlineSnapshot('"{  }"')
})
