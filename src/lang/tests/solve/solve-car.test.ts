import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Car", async () => {
  const output = await runCode(`

solve (ab: Pair(String, String), a: String) {
  unify a = car(ab)
  unify ab = cons("a", "b")
}

`)

  expect(output).toMatchInlineSnapshot('"{ ab: cons(\\"a\\", \\"b\\"), a: \\"a\\" }"')
})

test("solve Car -- nested", async () => {
  const output = await runCode(`

solve (ab: Pair(String, String), ba: Pair(String, String), a: String, b: String, b2: String) {
  unify b2 = car(ba)
  unify ba = cons(b, a)
  unify a = car(ab)
  unify b = cdr(ab)
  unify ab = cons("a", "b")

}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ ab: cons(\\"a\\", \\"b\\"), ba: cons(\\"b\\", \\"a\\"), a: \\"a\\", b: \\"b\\", b2: b }"',
  )
})

test("solve Car -- car cons", async () => {
  const output = await runCode(`

solve(a: String) {
  unify a = car(cons(a, "b"))
}
  
`)

  expect(output).toMatchInlineSnapshot('"{ a: TODO(String) }"')
})
