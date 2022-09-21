import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute the", async () => {
  const output = await runCode(`

compute the

`)

  expect(output).toMatchInlineSnapshot(
    '"(T1, x1) => x1: (T1: Type, x1: T1) -> T1"',
  )
})

test("compute the applied", async () => {
  const output = await runCode(`

compute the(Trivial, sole)

`)

  expect(output).toMatchInlineSnapshot('"sole: Trivial"')
})
