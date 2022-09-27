import { expect, test } from "vitest"
import { runCode } from "../utils"

test("unify FnImplicit", async () => {
  const output = await runCode(`

unify (x: String) {
  equation
    (implicit A: Type, implicit B: Type, a: A, b: B) => x =
    (implicit A: Type, implicit B: Type, a: A, b: B) => "abc"
}

`)

  expect(output).toMatchInlineSnapshot('"{ x: \\"abc\\" }"')
})

test("unify FnImplicit -- alpha equivalence", async () => {
  const output = await runCode(`

unify () {
  equation (implicit A: Type, a: A) => a = (implicit B: Type, b: B) => b
}

`)

  expect(output).toMatchInlineSnapshot('"{  }"')
})
