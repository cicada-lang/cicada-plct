import { expect, test } from "vitest"
import { runCode } from "../utils"

test("unify Sigma", async () => {
  const output = await runCode(`

unify (A: Type, B: Type) {
  equation Pair(A, B) = Pair(String, String)
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("unify Sigma -- nested", async () => {
  const output = await runCode(`

unify (A: Type, B: Type) {
  equation Pair(A, Pair(String, B)) = Pair(String, Pair(String, String))
  equation Pair(A, Pair(String, String)) = Pair(String, Pair(String, B))
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("unify Sigma -- occur twice", async () => {
  const output = await runCode(`

unify (A: Type, B: Type) {
  equation Pair(A, Pair(B, B)) = Pair(String, Pair(String, String))
  equation Pair(A, Pair(B, String)) = Pair(String, Pair(String, B))
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test.todo("unify Sigma -- generate const function", async () => {
  const output = await runCode(`

unify (A: Type, B: (x: A) -> Type) {
  equation exists (x: A) B(x) = exists (_: String) String
}

`)

  expect(output).toMatchInlineSnapshot()
})
