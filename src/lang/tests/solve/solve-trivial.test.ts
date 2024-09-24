import { expect, test } from "vitest"
import { runCode } from "../utils.js"

test("solve Trivial", async () => {
  const output = await runCode(`

solve () {
  Trivial = Trivial
}

`)

  expect(output).toMatchSnapshot()
})
