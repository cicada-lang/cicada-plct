import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("include Equal", async () => {
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

include [
  Equal(A, { a }, { a }),
  Equal(AB, { a, b }, { a, b }),
  Equal(ABC, { a, b, c }, { a, b, c }),
]

include [
  Equal(id(Type, A), { a }, { a }),
  Equal(id(Type, AB), { a, b }, id(AB, { a, b })),
  Equal(id(Type, ABC), id(ABC, { a, b, c }), { a, b, c }),
]

`)
})

test("include Equal -- fail", async () => {
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

include [
  Equal(AB, { a, b }, { a, b }),
  Equal(A, { a }, { a }),
]

`)
})
