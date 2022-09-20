import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("check ApNew", async () => {
  await runCode(`

class ABC {
  a: String
  b: String
  c: String
}

check new ABC("a", "b", "c"): ABC

`)
})

test("check ApNew -- prefilled", async () => {
  await runCode(`

class ABC {
  a: String
  b: Trivial = sole
  c: String
}

check new ABC("a", "c"): ABC

`)
})

test("check ApNew -- not enough args", async () => {
  await expectCodeToFail(`

class ABC {
  a: String
  b: String
  c: String
}

check new ABC("a", "b"): ABC

`)
})

test("check ApNew -- not enough args -- prefilled", async () => {
  await expectCodeToFail(`

class ABC {
  a: String
  b: Trivial = sole
  c: String
}

check new ABC("a"): ABC

`)
})

test("check ApNew -- too many args", async () => {
  await expectCodeToFail(`

class ABC {
  a: String
  b: String
  c: String
}

check new ABC("a", "b", "c", "d"): ABC

`)
})

test("check ApNew -- too many args -- prefilled", async () => {
  await expectCodeToFail(`

class ABC {
  a: String
  b: Trivial = sole
  c: String
}

check new ABC("a", "c", "d"): ABC

`)
})
