import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("solve Type", async () => {
  const output = await runCode(`

solve () {
  Type = Type
}

`)

  expect(output).toMatchSnapshot()
})
