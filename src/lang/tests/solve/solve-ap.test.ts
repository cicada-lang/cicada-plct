import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Ap -- same PatternVar", async () => {
  const output = await runCode(`

solve (f: (String) -> String, x: String) {
  unify f(x) = f(x)
}

`)

  expect(output).toMatchInlineSnapshot('"{ f: TODO((_: String) -> String), x: TODO(String) }"')
})

test("solve Ap -- PatternVar v.s. String", async () => {
  const output = await runCode(`

solve (f: (String) -> String, x: String) {
  unify f(x) = f("abc")
}

`)

  expect(output).toMatchInlineSnapshot('"{ f: TODO((_: String) -> String), x: \\"abc\\" }"')
})
