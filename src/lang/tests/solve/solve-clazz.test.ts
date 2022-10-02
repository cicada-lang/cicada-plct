import { expect, test } from "vitest"
import * as Errors from "../../errors"
import { expectCodeToFail, runCode } from "../utils"

test("solve Clazz", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  unify class { a: A, b: B } = class { a: String, b: String }
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve Clazz -- subclazz", async () => {
  const output = await runCode(`

solve (A: Type) {
  unify class { a: A } = class { a: String, b: String }
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String }"')
})

test("solve Clazz -- nested", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  unify class { c: class { a: A, b: B } } = class { c: class { a: String, b: String } }
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve Clazz -- occur twice", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  unify
    class { c: class { a: A, b: B }, b: String } =
    class { c: class { a: String, b: String }, b: B }
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve ClazzCons -- deepWalk", async () => {
  const output = await runCode(`

solve (A: Type, B: Type, C: Type) {
  unify C = class { a: A, b: B }
  unify A = String
  unify B = String
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ A: String, B: String, C: class { a: String, b: String } }"',
  )
})

test("solve ClazzFulfilled -- deepWalk", async () => {
  const output = await runCode(`

solve (A: Type, B: Type, C: Type, a: A, b: B) {
  unify C = class { a: A = a, b: B = b }
  unify A = String
  unify B = String
  unify a = "a"
  unify b = "b"
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ A: String, B: String, C: class { a: String = \\"a\\", b: String = \\"b\\" }, a: \\"a\\", b: \\"b\\" }"',
  )
})

test("solve Clazz -- occur", async () => {
  await expectCodeToFail(
    `

solve (A: Type) {
  unify class { a: A } = A
}

`,
    Errors.UnificationError,
  )
})
