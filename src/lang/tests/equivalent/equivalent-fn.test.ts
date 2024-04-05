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

  expect(output).toMatchSnapshot()
})

test("equivalent Fn -- alpha equivalent", async () => {
  const output = await runCode(`

compute equivalent forall (A: Type, B: Type) Type {
    (A, B) => A
  = (B, A) => B
}

`)

  expect(output).toMatchSnapshot()
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

  expect(output).toMatchSnapshot()
})

test("equivalent Fn -- fail", async () => {
  await expectCodeToFail(`

compute equivalent forall (A: Type, B: Type) Type {
    (A, B) => A
  = (A, B) => B
}

`)
})
