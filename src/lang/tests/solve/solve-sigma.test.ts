import { expect, test } from "vitest"
import * as Errors from "../../errors"
import { expectCodeToFail, runCode } from "../utils"

test("solve Sigma", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  Pair(A, B) = Pair(String, String)
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve Sigma -- nested", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  Pair(A, Pair(String, B)) = Pair(String, Pair(String, String))
  Pair(A, Pair(String, String)) = Pair(String, Pair(String, B))
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve Sigma -- occur twice", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  Pair(A, Pair(B, B)) = Pair(String, Pair(String, String))
  Pair(A, Pair(B, String)) = Pair(String, Pair(String, B))
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve Sigma -- occur in pair", async () => {
  await expectCodeToFail(
    `

solve (x: Type) {
  x = Pair(x, x)
}

`,
    Errors.UnificationError,
  )
})

test("solve Sigma -- generate const function", async () => {
  const output = await runCode(`

solve (A: Type, B: (x: A) -> Type) {
  exists (x: A) B(x) = exists (_: String) String
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: (x) => String }"')
})
