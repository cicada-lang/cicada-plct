import { expect, test } from "vitest"
import { runCode } from "../utils"

test("unify Box", async () => {
  const output = await runCode(`

function Box(T: Type): Type {
  return Pair(T, Trivial)
}

unify (x: String, y: Box(String), z: Box(Box(String))) {
  equation y = cons(x, sole)
  equation z = cons(y, sole)
  equation x = "abc"
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ x: \\"abc\\", y: cons(x, sole), z: cons(cons(x, sole), sole) }"',
  )
})
