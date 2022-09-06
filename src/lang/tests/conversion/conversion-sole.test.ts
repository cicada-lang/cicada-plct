import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("conversion Sole", async () => {
  await runCode(`

conversion Trivial [
  sole,
  sole,
]

`)
})

test("conversion Sole -- fail", async () => {
  await expectCodeToFail(`

conversion Trivial [
  sole,
  sole,
  Trivial,
]

`)
})
