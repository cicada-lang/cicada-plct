import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("compute Pi", async () => {
  const output = await runCode(`

compute (T: Type, x: T) -> T

`)

  expect(output).toMatchSnapshot()
})
