import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Same -- under the", async () => {
  const output = await runCode(`

compute the(Equal(String, "abc", "abc"), same("abc"))

`)

  expect(output).toMatchInlineSnapshot(
    '"refl(implicit String, implicit \\"abc\\"): Equal(String, \\"abc\\", \\"abc\\")"',
  )
})

test("compute Same -- given implicit", async () => {
  const output = await runCode(`

compute same(implicit String, "abc")

`)

  expect(output).toMatchInlineSnapshot(
    '"refl(implicit String, implicit \\"abc\\"): Equal(String, \\"abc\\", \\"abc\\")"',
  )
})
