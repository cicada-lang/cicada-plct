import { expect, test } from "vitest"
import { runCode } from "../utils.js"

test("compute Pair", async () => {
  const output = await runCode(`

compute Pair(Type, Type)

`)

  expect(output).toMatchSnapshot()
})
