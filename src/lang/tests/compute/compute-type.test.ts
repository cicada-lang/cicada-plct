import { expect, test } from "vitest"
import { runCode } from "../utils.js"

test("compute Type", async () => {
  const output = await runCode(`

compute Type

`)

  expect(output).toMatchSnapshot()
})
