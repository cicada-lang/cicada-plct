import { expect, test } from "vitest"
import { runCode } from "../utils"

test("unify PiImplicit -- occur twice", async () => {
  const output = await runCode(`

unify (A: Type, B: Type) {
  equation (implicit _: A, B) -> B = (implicit _: String, String) -> String
  equation (implicit _: A, B) -> String = (implicit _: String, String) -> B
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})
