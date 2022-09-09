import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("check NewNameless", async () => {
  await runCode(`

class ABC {
  a: String
  b: String
  c: String
}

check new ABC("a", "b", "c"): ABC

`)
})

test("check NewNameless -- prefilled", async () => {
  await runCode(`

class ABC {
  a: String
  b: Trivial = sole
  c: String
}

check new ABC("a", "c"): ABC

`)
})

test("check NewNameless -- not enough args", async () => {
  await expectCodeToFail(`

class ABC {
  a: String
  b: String
  c: String
}

check new ABC("a", "b"): ABC

`)
})

test("check NewNameless -- not enough args -- prefilled", async () => {
  await expectCodeToFail(`

class ABC {
  a: String
  b: Trivial = sole
  c: String
}

check new ABC("a"): ABC

`)
})

test("check NewNameless -- too many args", async () => {
  await expectCodeToFail(`

class ABC {
  a: String
  b: String
  c: String
}

check new ABC("a", "b", "c", "d"): ABC

`)
})

test("check NewNameless -- too many args -- prefilled", async () => {
  await expectCodeToFail(`

class ABC {
  a: String
  b: Trivial = sole
  c: String
}

check new ABC("a", "c", "d"): ABC

`)
})
