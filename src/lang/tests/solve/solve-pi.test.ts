import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Pi", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  equation (A) -> B = (String) -> String
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve Pi -- nested", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  equation (A, String) -> B = (String, String) -> String
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve Pi -- occur twice", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  equation (A, B) -> B = (String, String) -> String
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})
