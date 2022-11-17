import { expect, test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("equivalent Sigma", async () => {
  const output = await runCode(`

function id(T: Type, x: T): T {
  return x
}

compute equivalent Type {
    exists (A: Type) A
  = exists (B: Type) B
  = exists (B: Type) id(Type, B)
}

`)

  expect(output).toMatchInlineSnapshot(
    '"refl(implicit Type, implicit exists (Type) A): Equal(Type, exists (Type) A, exists (Type) B)"',
  )
})

test("equivalent Sigma -- nested", async () => {
  const output = await runCode(`

function id(T: Type, x: T): T {
  return x
}

compute equivalent Type {
    exists (A: Type, B: Type) Pair(A, B)
  = exists (B: Type, A: Type) Pair(B, A)
  = exists (B: Type, A: Type) Pair(id(Type, B), id(Type, A))
  = exists (B: Type, A: id(Type, Type)) Pair(id(Type, B), id(Type, A))
}

`)

  expect(output).toMatchInlineSnapshot(
    '"refl(implicit Type, implicit exists (Type, Type, A) B): Equal(Type, exists (Type, Type, A) B, exists (Type, Type, B) A)"',
  )
})

test("equivalent Sigma -- fail", async () => {
  await expectCodeToFail(`

compute equivalent Type {
    exists (A: Type, B: Type) Pair(A, B)
  = exists (A: Type, B: Type) Pair(B, A)
}

`)
})
