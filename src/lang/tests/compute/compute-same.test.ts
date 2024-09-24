import { expect, test } from "vitest"
import { runCode } from "../utils.js"

test("compute Same -- under the", async () => {
  const output = await runCode(`

compute the(Equal(String, "abc", "abc"), same("abc"))

`)

  expect(output).toMatchSnapshot()
})

test("compute Same -- given implicit", async () => {
  const output = await runCode(`

compute same(implicit String, "abc")

`)

  expect(output).toMatchSnapshot()
})
