import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Equal", async () => {
  const output = await runCode(`

compute Equal
compute Equal(String)
compute Equal(String, "abc")
compute Equal(String, "abc", "123")

`)

  expect(output).toMatchSnapshot()
})
