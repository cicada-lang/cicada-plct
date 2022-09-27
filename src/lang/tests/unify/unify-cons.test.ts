import { expect, test } from "vitest"
import { runCode } from "../utils"

test("unify Cons -- car", async () => {
  const output = await runCode(`

unify (a: String) {
  equation cons(a, "b") = cons("a", "b")
}

`)

  expect(output).toMatchInlineSnapshot('"{ a: \\"a\\" }"')
})

test("unify Cons -- cdr", async () => {
  const output = await runCode(`

unify (b: String) {
  equation cons("a", "b") = cons("a", b)
}

`)

  expect(output).toMatchInlineSnapshot('"{ b: \\"b\\" }"')
})

test("unify Cons -- car and cdr", async () => {
  const output = await runCode(`

unify (a: String, b: String) {
  equation cons(a, "b") = cons("a", b)
}

`)

  expect(output).toMatchInlineSnapshot('"{ a: \\"a\\", b: \\"b\\" }"')
})

test("unify Cons -- nested", async () => {
  const output = await runCode(`

unify (a: String, b: String) {
  equation cons(a, cons("b", "c")) = cons("a", cons(b, "c"))
}

`)

  expect(output).toMatchInlineSnapshot('"{ a: \\"a\\", b: \\"b\\" }"')
})
