import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("conversion Clazz", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

conversion Type [
  class { A: Type, x: A },
  class { A: Type, x: A },
  class { A: Type, x: id(Type, A) },
]

conversion Type [
  class { A: Type, B: Type, pair: Pair(A, B) },
  class { A: Type, B: Type, pair: Pair(A, B) },
]

`)
})

test("conversion Clazz -- fail -- different property names", async () => {
  await expectCodeToFail(`

conversion Type [
  class { A: Type, x: A },
  class { B: Type, x: B },
]

`)
})

test("conversion Clazz -- fail -- different property type", async () => {
  await expectCodeToFail(`

conversion Type [
  class { A: Trivial },
  class { A: String },
]

`)
})

test("conversion Clazz -- fail -- different fulfilled property value", async () => {
  await expectCodeToFail(`

conversion Type [
  class { A: String = "abc" },
  class { A: String = "xyz" },
]

`)
})

test("conversion Clazz -- fail -- missing fulfilled property value", async () => {
  await expectCodeToFail(`

conversion Type [
  class { A: String = "abc" },
  class { A: String },
]

conversion Type [
  class { A: String },
  class { A: String = "abc" },
]

`)
})
