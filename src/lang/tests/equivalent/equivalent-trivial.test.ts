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

  expect(output).toMatchSnapshot()
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
