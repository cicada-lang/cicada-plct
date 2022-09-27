import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Box", async () => {
  const output = await runCode(`

function Box(T: Type): Type {
  return Pair(T, Trivial)
}

solve (x: String, y: Box(String), z: Box(Box(String))) {
  equation y = cons(x, sole)
  equation z = cons(y, sole)
  equation x = "abc"
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ x: \\"abc\\", y: cons(x, sole), z: cons(cons(x, sole), sole) }"',
  )
})
