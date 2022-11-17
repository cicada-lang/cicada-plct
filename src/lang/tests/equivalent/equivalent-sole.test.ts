import { expect, test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("equivalent Sole", async () => {
  const output = await runCode(`

compute equivalent Trivial {
    sole
  = sole
}

`)

  expect(output).toMatchInlineSnapshot(
    '"refl(implicit Trivial, implicit sole): Equal(Trivial, sole, sole)"',
  )
})

test("equivalent Sole -- fail", async () => {
  await expectCodeToFail(`

compute equivalent Trivial {
    sole
  = sole
  = Trivial
}

`)
})
