import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("conversion Trivial", async () => {
  await runCode(`

conversion Type {
  Trivial
  Trivial
  Trivial
}

`)
})

test("conversion Trivial -- fail", async () => {
  await expectCodeToFail(`

conversion Type {
  Trivial
  Trivial
  Type
}

`)
})
