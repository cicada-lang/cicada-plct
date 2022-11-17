import { expect, test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("equivalent Trivial", async () => {
  const output = await runCode(`

compute equivalent Type {
    Trivial
  = Trivial
  = Trivial
}

`)

  expect(output).toMatchInlineSnapshot(
    '"refl(implicit Type, implicit Trivial): Equal(Type, Trivial, Trivial)"',
  )
})

test("equivalent Trivial -- fail", async () => {
  await expectCodeToFail(`

compute equivalent Type {
    Trivial
  = Trivial
  = Type
}

`)
})
