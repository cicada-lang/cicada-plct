import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Sigma", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  equation Pair(A, B) = Pair(String, String)
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve Sigma -- nested", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  equation Pair(A, Pair(String, B)) = Pair(String, Pair(String, String))
  equation Pair(A, Pair(String, String)) = Pair(String, Pair(String, B))
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve Sigma -- occur twice", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  equation Pair(A, Pair(B, B)) = Pair(String, Pair(String, String))
  equation Pair(A, Pair(B, String)) = Pair(String, Pair(String, B))
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test.todo("solve Sigma -- generate const function", async () => {
  const output = await runCode(`

solve (A: Type, B: (x: A) -> Type) {
  equation exists (x: A) B(x) = exists (_: String) String
}

`)

  expect(output).toMatchInlineSnapshot()
})
