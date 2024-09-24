import { expect, test } from "vitest"
import { runCode } from "../utils.js"

test("solve Car", async () => {
  const output = await runCode(`

solve (ab: Pair(String, String), a: String) {
  a = car(ab)
  ab = cons("a", "b")
}

`)

  expect(output).toMatchSnapshot()
})

test("solve Car -- nested", async () => {
  const output = await runCode(`

solve (ab: Pair(String, String), ba: Pair(String, String), a: String, b: String, b2: String) {
  b2 = car(ba)
  ba = cons(b, a)
  a = car(ab)
  b = cdr(ab)
  ab = cons("a", "b")
}

`)

  expect(output).toMatchSnapshot()
})

test("solve Car -- car cons", async () => {
  const output = await runCode(`

solve(a: String) {
  a = car(cons(a, "b"))
}

`)

  expect(output).toMatchSnapshot()
})
