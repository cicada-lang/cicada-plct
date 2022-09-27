import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve PiImplicit -- occur twice", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  unify (implicit _: A, B) -> B = (implicit _: String, String) -> String
  unify (implicit _: A, B) -> String = (implicit _: String, String) -> B
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})
