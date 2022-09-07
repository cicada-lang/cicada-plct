import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("inclusion Sigma", async () => {
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
  Pair(ABC, ABC),
  Pair(ABC, AB),
  Pair(AB, AB),
  Pair(A, AB),
  Pair(A, A),
]

inclusion [
  Pair(ABC, ABC),
  Pair(ABC, id(Type, AB)),
  Pair(id(Type, AB), AB),
  Pair(A, AB),
  Pair(A, A),
  Pair(id(Type, A), id(Type, A)),
]

`)
})

test("inclusion Sigma -- fail", async () => {
  await expectCodeToFail(`

class AB {
  A: String
  B: String
}

class A {
  A: String
}

inclusion [
  Pair(A, AB),
  Pair(AB, A),
]

`)
})
