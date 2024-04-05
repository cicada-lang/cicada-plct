import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("compute Sole", async () => {
  const output = await runCode(`

compute sole

`)

  expect(output).toMatchSnapshot()
})
