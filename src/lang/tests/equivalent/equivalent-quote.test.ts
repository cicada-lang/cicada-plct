import { expect, test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("equivalent Quote", async () => {
  const output = await runCode(`

compute equivalent String {
    "abc"
  = "abc"
  = "abc"
}

`)

  expect(output).toMatchSnapshot()
})

test("equivalent Quote -- empty string", async () => {
  const output = await runCode(`

compute equivalent String {
    ""
  = ""
  = ""
}

`)

  expect(output).toMatchSnapshot()
})

test("equivalent Quote -- fail", async () => {
  await expectCodeToFail(`

compute equivalent String {
    "abc"
  = "abc"
  = "xyz"
}

`)
})
