import { expect, test } from "bun:test"
import { expectCodeToFail, runCode } from "../utils"

test("equivalent Sole", async () => {
  const output = await runCode(`

compute equivalent Trivial {
    sole
  = sole
}

`)

  expect(output).toMatchSnapshot()
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
