import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("inclusion Equal", async () => {
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

let a = "a"
let b = "b"
let c = "c"

inclusion [
  Equal(ABC, { a, b, c }, { a, b, c }),
  Equal(AB, { a, b }, { a, b }),
  Equal(A, { a }, { a }),
]

inclusion [
  Equal(id(Type, ABC), id(ABC, { a, b, c }), { a, b, c }),
  Equal(id(Type, AB), { a, b }, id(AB, { a, b })),
  Equal(id(Type, A), { a }, { a }),
]

`)
})

test("inclusion Equal -- fail", async () => {
  await expectCodeToFail(`

class AB {
  a: String
  b: String
}

class A {
  a: String
}

let a = "a"
let b = "b"

inclusion [
  Equal(A, { a }, { a }),
  Equal(AB, { a, b }, { a, b }),
]

`)
})
