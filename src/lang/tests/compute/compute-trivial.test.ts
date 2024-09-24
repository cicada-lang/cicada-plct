import { expect, test } from "vitest"
import { runCode } from "../utils.js"

test("compute Trivial", async () => {
  const output = await runCode(`

compute Trivial

`)

  expect(output).toMatchSnapshot()
})
