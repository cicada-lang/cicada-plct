import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Box", async () => {
  const output = await runCode(`

function Box(T: Type): Type {
  return Pair(T, Trivial)
}

solve (x: String, y: Box(String), z: Box(Box(String))) {
  unify y = cons(x, sole)
  unify z = cons(y, sole)
  unify x = "abc"
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ x: \\"abc\\", y: cons(\\"abc\\", sole), z: cons(cons(\\"abc\\", sole), sole) }"',
  )
})
