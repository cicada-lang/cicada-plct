import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("inclusion Clazz", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

inclusion [
  class { A: Type, x: A },
  class { A: Type, x: A },
  class { A: Type, x: id(Type, A) },
  class { A: Type },
]

inclusion [
  class { A: Type, B: Type, pair: Pair(A, B) },
  class { A: Type, B: Type, pair: Pair(A, B) },
  class { A: Type, B: Type },
  class { B: Type },
]

`)
})

test("inclusion Clazz -- ABC", async () => {
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

inclusion [ ABC, AB, A ]

`)
})

test("inclusion Clazz -- out of order", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

inclusion [
  class { A: Type, B: Type, pair: Pair(A, B) },
  class { B: Type, A: Type, pair: Pair(A, B) },
  class { B: Type, A: Type },
  class { A: Type },
]

inclusion [
  class { A: Type, B: Type, pair: Pair(A, B) },
  class { B: Type, A: Type, pair: Pair(A, B) },
  class { B: Type, A: Type },
  class { B: Type },
]

inclusion [
  class { B: Type, A: id(Type, Type), pair: Pair(A, B) },
  class { B: Type, A: id(Type, Type), pair: Pair(id(Type, A), id(Type, B)) },
  class { B: Type, A: Type },
  class { A: Type, B: id(Type, Type) },
  class { B: Type },
  class { B: id(Type, Type) },
]

inclusion [
  class { B: Type, A: id(Type, Type), pair: Pair(A, B) },
  class { B: Type, A: id(Type, Type), pair: Pair(id(Type, A), id(Type, B)) },
  class { B: Type, A: Type },
  class { A: Type },
]

`)
})

test("inclusion Clazz -- fail -- different property names", async () => {
  await expectCodeToFail(`

inclusion [
  class { A: Type, x: A },
  class { B: Type, x: B },
]

`)
})

test("inclusion Clazz -- fail -- different property type", async () => {
  await expectCodeToFail(`

inclusion [
  class { A: Trivial },
  class { A: String },
]

`)
})

test("inclusion Clazz -- fail -- different fulfilled property value", async () => {
  await expectCodeToFail(`

inclusion [
  class { A: String = "abc" },
  class { A: String = "xyz" },
]

`)
})

test("inclusion Clazz -- subclazz has fulfilled property value", async () => {
  await runCode(`

inclusion [
  class { A: String = "abc" },
  class { A: String },
]

`)
})

test("inclusion Clazz -- fail -- missing fulfilled property value", async () => {
  await expectCodeToFail(`

inclusion [
  class { A: String },
  class { A: String = "abc" },
]

`)
})

test("inclusion Clazz -- nested", async () => {
  await runCode(`

inclusion [
  class { A: String, B: String, C: class { X: String, Y: String, Z: String } },
  class { A: String, B: String, C: class { X: String, Y: String } },
  class { A: String, B: String, C: class { Y: String } },
  class { B: String, C: class { Y: String } },
  class { C: class { Y: String } },
]

`)
})
