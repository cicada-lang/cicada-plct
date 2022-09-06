import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("conversion Quote", async () => {
  await runCode(`

conversion String [
  "abc",
  "abc",
  "abc",
]

`)
})

test("conversion Quote -- empty string", async () => {
  await runCode(`

conversion String [
  "",
  "",
  "",
]

`)
})

test("conversion Quote -- fail", async () => {
  await expectCodeToFail(`

conversion String [
  "abc",
  "abc",
  "xyz",
]

`)
})
