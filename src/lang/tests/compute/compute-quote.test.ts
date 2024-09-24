import { expect, test } from "vitest"
import { runCode } from "../utils.js"

test("compute Quote", async () => {
  const output = await runCode(`

compute "abc"

`)

  expect(output).toMatchSnapshot()
})
