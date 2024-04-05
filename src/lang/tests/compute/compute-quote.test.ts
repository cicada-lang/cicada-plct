import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Quote", async () => {
  const output = await runCode(`

compute "abc"

`)

  expect(output).toMatchSnapshot()
})
