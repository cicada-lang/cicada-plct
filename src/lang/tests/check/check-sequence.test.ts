import { test } from "vitest"
import { runCode } from "../utils"

test("check Sequence -- single return", async () => {
  await runCode(`

check {
  return sole
}: Trivial

`)
})

test("check SequenceLetThe -- let function", async () => {
  await runCode(`

let x = {
  let id: (T: Type, T) -> T = (T, x) => x
  return id
}

check x: (T: Type, T) -> T

`)
})

test("check Sequence -- Let", async () => {
  await runCode(`

check {
  let x = sole
  return x
}: Trivial

`)
})

test("check Sequence -- LetThe", async () => {
  await runCode(`

check {
  let x: Trivial = sole
  return x
}: Trivial

`)
})

test("check Sequence -- multiple lets", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

check {
  let x: Trivial = sole
  let y = id(Trivial, sole)
  return y
}: Trivial

`)
})

test("check Sequence -- Check", async () => {
  await runCode(`

check {
  check sole: Trivial
  return sole
}: Trivial

`)
})
