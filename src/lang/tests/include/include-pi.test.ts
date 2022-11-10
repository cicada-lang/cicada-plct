import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("include Pi", async () => {
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

include [
  (A) -> ABC,
  (A) -> AB,
  (AB) -> AB,
  (ABC) -> AB,
  (ABC) -> A,
]


include [
  (A) -> ABC,
  (A) -> AB,
  (AB) -> id(Type, AB),
  (id(Type, ABC)) -> AB,
  (ABC) -> id(Type, A),
]

include [
  (A) -> AB,
  (AB) -> A,
]

`)
})

test("include Pi -- fail", async () => {
  await expectCodeToFail(`

class AB {
  a: String
  b: String
}

class A {
  a: String
}

include [
  (AB) -> A,
  (A) -> AB,
]

`)
})
