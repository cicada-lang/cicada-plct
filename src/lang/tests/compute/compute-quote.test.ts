import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("compute Quote", async () => {
  const output = await runCode(`

compute "abc"

`)

  expect(output).toMatchSnapshot()
})
