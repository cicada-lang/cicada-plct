import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Box -- implicit", async () => {
  const output = await runCode(`

function Box(T: Type): Type {
  return Pair(T, Trivial)
}

function box(implicit T: Type, x: T): Box(T) {
  return cons(x, sole)
}

solve (x: String, y: Box(String), z: Box(Box(String))) {
  y = box(x)
  z = box(y)
  x = "abc"
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{
      x: \\"abc\\",
      y: cons(\\"abc\\", sole),
      z: cons(cons(\\"abc\\", sole), sole)
    }"
  `,
  )
})
