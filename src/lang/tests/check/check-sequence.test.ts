import { test } from "vitest"
import { runCode } from "../utils"

test.todo("check Sequence -- single return", async () => {
  await runCode(`

check begin {
  return Trivial
}: Type

`)
})

test.todo("check Sequence -- Let", async () => {
  await runCode(`

check begin {
  let x = Trivial
  return x
}: Type

`)
})
