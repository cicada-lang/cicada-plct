import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Cons -- car", async () => {
  const output = await runCode(`

solve (a: String) {
  cons(a, "b") = cons("a", "b")
}

`)

  expect(output).toMatchInlineSnapshot('"{ a: \\"a\\" }"')
})

test("solve Cons -- cdr", async () => {
  const output = await runCode(`

solve (b: String) {
  cons("a", "b") = cons("a", b)
}

`)

  expect(output).toMatchInlineSnapshot('"{ b: \\"b\\" }"')
})

test("solve Cons -- car and cdr", async () => {
  const output = await runCode(`

solve (a: String, b: String) {
  cons(a, "b") = cons("a", b)
}

`)

  expect(output).toMatchInlineSnapshot('"{ a: \\"a\\", b: \\"b\\" }"')
})

test("solve Cons -- nested", async () => {
  const output = await runCode(`

solve (a: String, b: String) {
  cons(a, cons("b", "c")) = cons("a", cons(b, "c"))
}

`)

  expect(output).toMatchInlineSnapshot('"{ a: \\"a\\", b: \\"b\\" }"')
})

test("solve Cons -- deepWalk", async () => {
  const output = await runCode(`

solve (a: String, b: String, c: Pair(String, String)) {

  cons(a, b) = c
  a = "a"
  b = "b"
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ a: \\"a\\", b: \\"b\\", c: cons(\\"a\\", \\"b\\") }"',
  )
})
