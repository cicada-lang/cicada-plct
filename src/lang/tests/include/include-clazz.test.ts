import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("include Clazz", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

include [
  class { A: Type },
  class { A: Type, x: id(Type, A) },
  class { A: Type, x: A },
  class { A: Type, x: A },
]

include [
  class { B: Type },
  class { A: Type, B: Type },
  class { A: Type, B: Type, pair: Pair(A, B) },
  class { A: Type, B: Type, pair: Pair(A, B) },
]

`)
})

test("include Clazz -- ABC", async () => {
  await runCode(`

class ABC {
  A: String
  B: String
  C: String
}

class AB {
  A: String
  B: String
}

class A {
  A: String
}

include [ A, AB, ABC ]

`)
})

test("include Clazz -- fulfilled v.s. dependent", async () => {
  await expectCodeToFail(`

include [
  class { T: Type, x: T },
  class { T: Type = String, x: Type = Type },
]

`)
})

test("include Clazz -- fail -- different property names", async () => {
  await expectCodeToFail(`

include [
  class { B: Type, x: B },
  class { A: Type, x: A },
]

`)
})

test("include Clazz -- fail -- different property type", async () => {
  await expectCodeToFail(`

include [
  class { A: String },
  class { A: Trivial },
]

`)
})

test("include Clazz -- fail -- different fulfilled property value", async () => {
  await expectCodeToFail(`

include [
  class { A: String = "xyz" },
  class { A: String = "abc" },
]

`)
})

test("include Clazz -- subclazz has fulfilled property value", async () => {
  await runCode(`

include [
  class { A: String },
  class { A: String = "abc" },
]

`)
})

test("include Clazz -- fail -- missing fulfilled property value", async () => {
  await expectCodeToFail(`

include [
  class { A: String = "abc" },
  class { A: String },
]

`)
})

test("include Clazz -- nested", async () => {
  await runCode(`

include [
  class { C: class { Y: String } },
  class { B: String, C: class { Y: String } },
  class { A: String, B: String, C: class { Y: String } },
  class { A: String, B: String, C: class { X: String, Y: String } },
  class { A: String, B: String, C: class { X: String, Y: String, Z: String } },
]

`)
})
