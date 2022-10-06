import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("inclusion Pi", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

class ABC {
  a: String
  b: String
  c: String
}

class AB {
  a: String
  b: String
}

class A {
  a: String
}

inclusion [
  (A) -> ABC,
  (A) -> AB,
  (AB) -> AB,
  (ABC) -> AB,
  (ABC) -> A,
]


inclusion [
  (A) -> ABC,
  (A) -> AB,
  (AB) -> id(Type, AB),
  (id(Type, ABC)) -> AB,
  (ABC) -> id(Type, A),
]

inclusion [
  (A) -> AB,
  (AB) -> A,
]

`)
})

test("inclusion Pi -- fail", async () => {
  await expectCodeToFail(`

class AB {
  a: String
  b: String
}

class A {
  a: String
}

inclusion [
  (AB) -> A,
  (A) -> AB,
]

`)
})
