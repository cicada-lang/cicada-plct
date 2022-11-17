import { expect, test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("equivalent Fn", async () => {
  const output = await runCode(`

function id(T: Type, x: T): T {
  return x
}

compute equivalent forall (T: Type, x: T) T {
    id
  = (T, x) => x
  = (T, x) => id(T, x)
}

`)

  expect(output).toMatchInlineSnapshot(`
    "refl(
      implicit (T11: Type, T11) -> T11,
      implicit (T11, x11) => x11,
    ): Equal((T2: Type, T2) -> T2, (T2, x2) => x2, (T2, x2) => x2)"
  `)
})

test("equivalent Fn -- alpha equivalent", async () => {
  const output = await runCode(`

compute equivalent forall (A: Type, B: Type) Type {
    (A, B) => A
  = (B, A) => B
}

`)

  expect(output).toMatchInlineSnapshot(
    '"refl(implicit (Type, Type) -> Type, implicit (A, B) => A): Equal((Type, Type) -> Type, (A, B) => A, (A, B) => A)"',
  )
})

test("equivalent FnAnnotated", async () => {
  const output = await runCode(`

function id(T: Type, x: T): T {
  return x
}

compute equivalent forall (T: Type, x: T) T {
    id
  = (T, x) => x
  = (T, x) => id(T, x)
  = (T: Type, x: T) => x
  = (T: Type, x: T) => id(T, x)
}

`)

  expect(output).toMatchInlineSnapshot(`
    "refl(
      implicit (T81: Type, T81) -> T81,
      implicit (T81, x81) => x81,
    ): Equal(
      (T11: Type, T11) -> T11,
      (T11, x11) => x11,
      (T11, x11) => x11,
    )"
  `)
})

test("equivalent Fn -- fail", async () => {
  await expectCodeToFail(`

compute equivalent forall (A: Type, B: Type) Type {
    (A, B) => A
  = (A, B) => B
}

`)
})
