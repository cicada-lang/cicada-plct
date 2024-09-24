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
  (ABC) -> A,
  (ABC) -> AB,
  (AB) -> AB,
  (A) -> AB,
  (A) -> ABC,
]


include [
  (ABC) -> id(Type, A),
  (id(Type, ABC)) -> AB,
  (AB) -> id(Type, AB),
  (A) -> AB,
  (A) -> ABC,
]

include [
  (AB) -> A,
  (A) -> AB,
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
  (A) -> AB,
  (AB) -> A,
]

`)
})
