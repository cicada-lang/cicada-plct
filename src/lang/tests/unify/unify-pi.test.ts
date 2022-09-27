import { expect, test } from "vitest"
import { runCode } from "../utils"

test("unify Pi", async () => {
  const output = await runCode(`

unify (A: Type, B: Type) {
  equation (A) -> B = (String) -> String
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("unify Pi -- nested", async () => {
  const output = await runCode(`

unify (A: Type, B: Type) {
  equation (A, String) -> B = (String, String) -> String
  equation (A, String) -> String = (String, String) -> B
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("unify Pi -- occur twice", async () => {
  const output = await runCode(`

unify (A: Type, B: Type) {
  equation (A, B) -> B = (String, String) -> String
  equation (A, B) -> String = (String, String) -> B
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})
