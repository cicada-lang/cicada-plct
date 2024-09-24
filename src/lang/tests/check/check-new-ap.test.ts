import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils.js"

test("check NewAp", async () => {
  await runCode(`

class ABC {
  a: String
  b: String
  c: String
}

check new ABC("a", "b", "c"): ABC

`)
})

test("check NewAp -- prefilled", async () => {
  await runCode(`

class ABC {
  a: String
  b: Trivial = sole
  c: String
}

check new ABC("a", "c"): ABC

`)
})

test("check NewAp -- not enough args", async () => {
  await expectCodeToFail(`

class ABC {
  a: String
  b: String
  c: String
}

check new ABC("a", "b"): ABC

`)
})

test("check NewAp -- not enough args -- prefilled", async () => {
  await expectCodeToFail(`

class ABC {
  a: String
  b: Trivial = sole
  c: String
}

check new ABC("a"): ABC

`)
})

test("check NewAp -- too many args", async () => {
  await expectCodeToFail(`

class ABC {
  a: String
  b: String
  c: String
}

check new ABC("a", "b", "c", "d"): ABC

`)
})

test("check NewAp -- too many args -- prefilled", async () => {
  await expectCodeToFail(`

class ABC {
  a: String
  b: Trivial = sole
  c: String
}

check new ABC("a", "c", "d"): ABC

`)
})
