import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("equivalent String", async () => {
  await runCode(`

equivalent Type [
  String,
  String,
  String,
]

`)
})

test("equivalent String -- fail", async () => {
  await expectCodeToFail(`

equivalent Type [
  String,
  String,
  Type,
]

`)
})
