import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("conversion Sigma", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

conversion Type {
  exists (A: Type) A
  exists (B: Type) B
  exists (B: Type) id(Type, B)
}

conversion Type {
  exists (A: Type, B: Type) Pair(A, B)
  exists (B: Type, A: Type) Pair(B, A)
  exists (B: Type, A: Type) Pair(id(Type, B), id(Type, A))
  exists (B: Type, A: id(Type, Type)) Pair(id(Type, B), id(Type, A))
}

`)
})

test("conversion Sigma -- fail", async () => {
  await expectCodeToFail(`

conversion Type {
  exists (A: Type, B: Type) Pair(A, B)
  exists (A: Type, B: Type) Pair(B, A)
}

`)
})
