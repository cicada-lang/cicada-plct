import { expect, test } from "vitest"
import * as Errors from "../../errors"
import { expectCodeToFail, runCode } from "../utils"

test("solve Pi", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  (A) -> B = (String) -> String
}

`)

  expect(output).toMatchInlineSnapshot(`
    "{
      A: String,
      B: String
    }"
  `)
})

test("solve Pi -- nested", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  (A, String) -> B = (String, String) -> String
  (A, String) -> String = (String, String) -> B
}

`)

  expect(output).toMatchInlineSnapshot(`
    "{
      A: String,
      B: String
    }"
  `)
})

test("solve Pi -- occur twice", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  (A, B) -> B = (String, String) -> String
  (A, B) -> String = (String, String) -> B
}

`)

  expect(output).toMatchInlineSnapshot(`
    "{
      A: String,
      B: String
    }"
  `)
})

test("solve Pi -- deepWalk", async () => {
  const output = await runCode(`

solve (A: Type, B: Type, C: Type) {
  // NOTE To test deepWalk, the order matters here.
  C = (A) -> B
  A = String
  B = String
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{
      A: String,
      B: String,
      C: (String) -> String
    }"
  `,
  )
})

test("solve Pi -- occur in Pi", async () => {
  await expectCodeToFail(
    `
  
solve (T: Type) {
  T = (T) -> T
}

`,
    Errors.ElaborationError,
  )
})

test("solve Pi -- occur in Pi -- nested", async () => {
  await expectCodeToFail(
    `

solve (A: Type, B: Type) {
  (A) -> B = (A) -> (B) -> B
}

`,
    Errors.ElaborationError,
  )
})

test("solve Pi -- occur shadowed by Pi", async () => {
  const output = await runCode(`
  
solve (X: Type) {
  X = (X: Type) -> X
}
  
`)

  expect(output).toMatchInlineSnapshot(`
    "{
      X: (X1: Type) -> X1
    }"
  `)
})
