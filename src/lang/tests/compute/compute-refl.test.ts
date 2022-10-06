import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Equal -- given implicit", async () => {
  const output = await runCode(`

compute refl(implicit String, implicit "abc")

`)

  expect(output).toMatchInlineSnapshot(
    '"refl(implicit String, implicit \\"abc\\"): Equal(String, \\"abc\\", \\"abc\\")"',
  )
})
