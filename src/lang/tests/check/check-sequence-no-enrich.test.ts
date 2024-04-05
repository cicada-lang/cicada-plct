import { test } from "bun:test"
import { runCode } from "../utils"

test("check SequenceLetThe -- no enrich", async () => {
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

test("check SequenceLetThe -- no enrich -- nested Objekt", async () => {
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
