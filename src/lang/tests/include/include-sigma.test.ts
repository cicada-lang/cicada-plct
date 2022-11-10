import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("include Sigma", async () => {
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
  Pair(ABC, ABC),
  Pair(ABC, AB),
  Pair(AB, AB),
  Pair(A, AB),
  Pair(A, A),
]

include [
  Pair(ABC, ABC),
  Pair(ABC, id(Type, AB)),
  Pair(id(Type, AB), AB),
  Pair(A, AB),
  Pair(A, A),
  Pair(id(Type, A), id(Type, A)),
]

`)
})

test("include Sigma -- fail", async () => {
  await expectCodeToFail(`

class AB {
  a: String
  b: String
}

class A {
  a: String
}

include [
  Pair(A, AB),
  Pair(AB, A),
]

`)
})
