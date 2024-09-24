import { expect, test } from "vitest"
import { runCode } from "../utils.js"

test("compute the", async () => {
  const output = await runCode(`

compute the

`)

  expect(output).toMatchSnapshot()
})

test("compute the applied", async () => {
  const output = await runCode(`

compute the(Trivial, sole)

`)

  expect(output).toMatchSnapshot()
})
