import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute the", async () => {
  const output = await runCode(`

compute the

`)

  expect(output).toMatchInlineSnapshot('"(T, x) => x: (T: Type, T) -> T"')
})

test("compute the applied", async () => {
  const output = await runCode(`

compute the(Trivial, sole)

`)

  expect(output).toMatchInlineSnapshot('"sole: Trivial"')
})
