import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("solve Trivial", async () => {
  const output = await runCode(`

solve () {
  Trivial = Trivial
}

`)

  expect(output).toMatchSnapshot()
})
