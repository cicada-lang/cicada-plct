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

test("check Sequence -- multiple lets", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

check begin {
  let x: Trivial = sole
  let y = id(Trivial, sole)
  return y
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

test.todo("check Sequence -- LetThe and enrich", async () => {
  await runCode(`

class AB {
  a: String
  b: String
}

class ABC {
  a: String
  b: String
  c: String
}

check begin {
  let abc: AB = {
    a: "a",
    b: "b",
    c: "c",
  }

  check abc: ABC

  return abc
}: ABC

`)
})
