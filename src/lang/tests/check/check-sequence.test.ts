import { test } from "vitest"
import { runCode } from "../utils"

test("check Sequence -- single return", async () => {
  await runCode(`

check begin {
  return sole
}: Trivial

`)
})

test("check Sequence -- Let", async () => {
  await runCode(`

check begin {
  let x = sole
  return x
}: Trivial

`)
})

test("check Sequence -- LetThe", async () => {
  await runCode(`

check begin {
  let x: Trivial = sole
  return x
}: Trivial

`)
})

test("check Sequence -- Check", async () => {
  await runCode(`

check begin {
  check sole: Trivial
  return sole
}: Trivial

`)
})
