import { test } from "vitest"
import { runCode } from "../utils"

test("enrich SequenceLetThe", async () => {
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

test("enrich SequenceLetThe -- nested Objekt", async () => {
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

check begin {
  let abc: AB = {
    a: "a",
    b: "b",
    c: "c",
    xyz: the(XY, {
      x: "x",
      y: "y",
      z: "z",
    })
  }

  check abc: ABC

  return abc
}: class {
  a: String
  b: String
  c: String
  xyz: XYZ
}

`)
})