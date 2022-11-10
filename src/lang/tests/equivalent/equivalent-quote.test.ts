import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("equivalent Quote", async () => {
  await runCode(`

equivalent String [
  "abc",
  "abc",
  "abc",
]

`)
})

test("equivalent Quote -- empty string", async () => {
  await runCode(`

equivalent String [
  "",
  "",
  "",
]

`)
})

test("equivalent Quote -- fail", async () => {
  await expectCodeToFail(`

equivalent String [
  "abc",
  "abc",
  "xyz",
]

`)
})
