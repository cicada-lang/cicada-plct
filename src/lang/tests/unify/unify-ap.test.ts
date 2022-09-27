import { expect, test } from "vitest"
import { runCode } from "../utils"

test("unify Ap -- same PatternVar", async () => {
  const output = await runCode(`

unify (f: (String) -> String, x: String) {
  equation f(x) = f(x)
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ f: TODO((_: String) -> String), x: TODO(String) }"',
  )
})

test("unify Ap -- PatternVar v.s. String", async () => {
  const output = await runCode(`

unify (f: (String) -> String, x: String) {
  equation f(x) = f("abc")
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ f: TODO((_: String) -> String), x: \\"abc\\" }"',
  )
})
