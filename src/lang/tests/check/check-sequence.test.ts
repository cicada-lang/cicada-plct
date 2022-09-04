import { test } from "vitest"
import { runCode } from "../utils"

test("check Sequence -- single return", async () => {
  await runCode(`

check begin {
  return Trivial
}: Type

`)
})

test("check Sequence -- Let", async () => {
  await runCode(`

check begin {
  let x = Trivial
  return x
}: Type

`)
})
