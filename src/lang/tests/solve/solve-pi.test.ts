import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Pi", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  unify (A) -> B = (String) -> String
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve Pi -- nested", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  unify (A, String) -> B = (String, String) -> String
  unify (A, String) -> String = (String, String) -> B
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve Pi -- occur twice", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  unify (A, B) -> B = (String, String) -> String
  unify (A, B) -> String = (String, String) -> B
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve Pi -- deepWalk", async () => {
  const output = await runCode(`

solve (A: Type, B: Type, C: Type) {
  unify (A, B) -> B = (String, String) -> String
  unify (A, B) -> String = (String, String) -> B
  unify C = (A) -> B
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ A: String, B: String, C: (_1: String) -> String }"',
  )
})
