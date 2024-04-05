import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("compute Type", async () => {
  const output = await runCode(`

compute Type

`)

  expect(output).toMatchSnapshot()
})
