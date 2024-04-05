import { test } from "bun:test"
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
  Pair(A, A),
  Pair(A, AB),
  Pair(AB, AB),
  Pair(ABC, AB),
  Pair(ABC, ABC),
]

include [
  Pair(id(Type, A), id(Type, A)),
  Pair(A, A),
  Pair(A, AB),
  Pair(id(Type, AB), AB),
  Pair(ABC, id(Type, AB)),
  Pair(ABC, ABC),
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
  Pair(AB, A),
  Pair(A, AB),
]

`)
})
