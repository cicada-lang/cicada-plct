import { expect, test } from "vitest"
import { runCode } from "../utils.js"

test("compute Sigma", async () => {
  const output = await runCode(`

compute exists (Type) Type

`)

  expect(output).toMatchSnapshot()
})
