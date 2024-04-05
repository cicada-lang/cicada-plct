import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("compute Sigma", async () => {
  const output = await runCode(`

compute exists (Type) Type

`)

  expect(output).toMatchSnapshot()
})
