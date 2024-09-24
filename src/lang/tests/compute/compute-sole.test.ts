import { expect, test } from "vitest"
import { runCode } from "../utils.js"

test("compute Sole", async () => {
  const output = await runCode(`

compute sole

`)

  expect(output).toMatchSnapshot()
})
