import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("conversion String", async () => {
  await runCode(`

conversion Type {
  String
  String
  String
}

`)
})

test("conversion String -- fail", async () => {
  await expectCodeToFail(`

conversion Type {
  String
  String
  Type
}

`)
})
