import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Box", async () => {
  const output = await runCode(`

function Box(T: Type): Type {
  return Pair(T, Trivial)
}

function box(implicit T: Type, x: T): Box(T) {
  return cons(x, sole)
}

// TODO Be able to call box directly.

solve (x: String, y: Box(String), z: Box(Box(String))) {
  // equation y = box(x)
  equation y = cons(x, sole)
  equation z = cons(y, sole)
  equation x = "abc"
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ x: \\"abc\\", y: cons(x, sole), z: cons(cons(car(y), sole), sole) }"',
  )
})
