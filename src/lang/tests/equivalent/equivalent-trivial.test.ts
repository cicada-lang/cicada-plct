import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("equivalent Trivial", async () => {
  await runCode(`

equivalent Type [
  Trivial,
  Trivial,
  Trivial,
]

`)
})

test("equivalent Trivial -- fail", async () => {
  await expectCodeToFail(`

equivalent Type [
  Trivial,
  Trivial,
  Type,
]

`)
})
