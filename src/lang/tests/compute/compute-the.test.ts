import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute the", async () => {
  const output = await runCode(`

compute the

`)

  expect(output).toMatchInlineSnapshot(
    '"(T2, x11) => x11: (T2: Type, x11: T2) -> T2"',
  )
})

test("compute the applied", async () => {
  const output = await runCode(`

compute the(Trivial, sole)

`)

  expect(output).toMatchInlineSnapshot('"sole: Trivial"')
})
