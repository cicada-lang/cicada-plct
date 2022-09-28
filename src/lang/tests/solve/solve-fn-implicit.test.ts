import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve FnImplicit", async () => {
  const output = await runCode(`

solve (x: String) {
  unify
    (implicit A: Type, implicit B: Type, a: A, b: B) => x =
    (implicit A: Type, implicit B: Type, a: A, b: B) => "abc"
}

`)

  expect(output).toMatchInlineSnapshot('"{ x: \\"abc\\" }"')
})

test("solve FnImplicit -- alpha equivalence", async () => {
  const output = await runCode(`

solve () {
  unify (implicit A: Type, a: A) => a = (implicit B: Type, b: B) => b
}

`)

  expect(output).toMatchInlineSnapshot('"{  }"')
})