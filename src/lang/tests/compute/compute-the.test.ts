import { expect, test } from "bun:test"
import { runCode } from "../utils"

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
