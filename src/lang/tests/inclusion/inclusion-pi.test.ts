import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("inclusion Pi", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

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
  A: String
  B: String
}

class A {
  A: String
}

inclusion [
  (AB) -> A,
  (A) -> AB,
]

`)
})
