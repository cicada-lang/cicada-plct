import { expect, test } from "vitest"
import { expectCodeToFail, runCode } from "../utils.js"

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
