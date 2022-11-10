import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("equivalent Sole", async () => {
  await runCode(`

equivalent Trivial [
  sole,
  sole,
]

`)
})

test("equivalent Sole -- fail", async () => {
  await expectCodeToFail(`

equivalent Trivial [
  sole,
  sole,
  Trivial,
]

`)
})
