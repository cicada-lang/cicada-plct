import { expect, test } from "vitest"
import { runCode } from "../utils.js"

test("solve Type", async () => {
  const output = await runCode(`

solve () {
  Type = Type
}

`)

  expect(output).toMatchSnapshot()
})
