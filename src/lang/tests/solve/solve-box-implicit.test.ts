import { expect, test } from "vitest"
import { runCode } from "../utils"

test.todo("solve Box -- implicit", async () => {
  const output = await runCode(`

function Box(T: Type): Type {
  return Pair(T, Trivial)
}

function box(implicit T: Type, x: T): Box(T) {
  return cons(x, sole)
}

solve (x: String, y: Box(String), z: Box(Box(String))) {
  equation y = box(x)
  equation z = box(y)
  equation x = "abc"
}

`)

  expect(output).toMatchInlineSnapshot()
})
