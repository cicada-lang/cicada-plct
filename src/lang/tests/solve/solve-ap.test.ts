import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Ap -- same PatternVar", async () => {
  const output = await runCode(`

solve (f: (String) -> String, x: String) {
  f(x) = f(x)
}

`)

  expect(output).toMatchSnapshot()
})

test("solve Ap -- PatternVar v.s. String", async () => {
  const output = await runCode(`

solve (f: (String) -> String, x: String) {
  f(x) = f("abc")
}

`)

  expect(output).toMatchSnapshot()
})

test("solve Ap -- deepWalk", async () => {
  const output = await runCode(`

solve (f: (String) -> String, x: String, c: String) {
  c = f(x)
  f(x) = f("abc")
}

`)

  expect(output).toMatchSnapshot()
})
