import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("compute Trivial", async () => {
  const output = await runCode(`

compute Trivial

`)

  expect(output).toMatchSnapshot()
})
