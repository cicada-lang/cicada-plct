import { expect, test } from "vitest"
import { runCode } from "../utils.js"

test("compute String", async () => {
  const output = await runCode(`

compute String

`)

  expect(output).toMatchSnapshot()
})
