import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("compute Pair", async () => {
  const output = await runCode(`

compute Pair(Type, Type)

`)

  expect(output).toMatchSnapshot()
})
