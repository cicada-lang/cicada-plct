import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Refl -- under the", async () => {
  const output = await runCode(`

compute the(Equal(String, "abc", "abc"), refl)

`)

  expect(output).toMatchSnapshot()
})

test("compute Refl -- given implicit", async () => {
  const output = await runCode(`

compute refl(implicit String, implicit "abc")

`)

  expect(output).toMatchSnapshot()
})
