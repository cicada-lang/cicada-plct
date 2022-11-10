import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("equivalent Clazz", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

equivalent Type [
  class { A: Type, x: A },
  class { A: Type, x: A },
  class { A: Type, x: id(Type, A) },
]

equivalent Type [
  class { A: Type, B: Type, pair: Pair(A, B) },
  class { A: Type, B: Type, pair: Pair(A, B) },
]

`)
})

test("equivalent Clazz -- fail -- different property names", async () => {
  await expectCodeToFail(`

equivalent Type [
  class { A: Type, x: A },
  class { B: Type, x: B },
]

`)
})

test("equivalent Clazz -- fail -- different property type", async () => {
  await expectCodeToFail(`

equivalent Type [
  class { A: Trivial },
  class { A: String },
]

`)
})

test("equivalent Clazz -- fail -- different fulfilled property value", async () => {
  await expectCodeToFail(`

equivalent Type [
  class { A: String = "abc" },
  class { A: String = "xyz" },
]

`)
})

test("equivalent Clazz -- fail -- missing fulfilled property value", async () => {
  await expectCodeToFail(`

equivalent Type [
  class { A: String = "abc" },
  class { A: String },
]

equivalent Type [
  class { A: String },
  class { A: String = "abc" },
]

`)
})
