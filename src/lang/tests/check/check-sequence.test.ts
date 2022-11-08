import { test } from "vitest"
import { runCode } from "../utils"

test("check Sequence -- single return", async () => {
  await runCode(`

check {
  return sole
}: Trivial

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

test("SequenceLetThe -- should not break normal let", async () => {
  await runCode(`

let x = {
  let id: (T: Type, T) -> T = (T, x) => x
  return id
}

`)
})

test("SequenceLetThe -- no enrich", async () => {
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

check {
  let abc: AB = {
    a: "a",
    b: "b",
    c: "c",
  }

  check abc: AB

  return abc
}: AB

`)
})

test("SequenceLetThe -- no enrich -- nested Objekt", async () => {
  await runCode(`

class XY {
  x: String
  y: String
}

class XYZ {
  x: String
  y: String
  z: String
}

class AB {
  a: String
  b: String
}

class ABC {
  a: String
  b: String
  c: String
}

check {
  let abc: AB = {
    a: "a",
    b: "b",
    c: "c",
    xyz: {
      x: "x",
      y: "y",
      z: "z",
    }
  }

  check abc: AB

  return abc
}: AB

`)
})
