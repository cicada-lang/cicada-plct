import { expect, test } from "vitest"
import { runCode } from "../utils.js"

test("solve Box", async () => {
  const output = await runCode(`

function Box(T: Type): Type {
  return Pair(T, Trivial)
}

solve (x: String, y: Box(String), z: Box(Box(String))) {
  y = cons(x, sole)
  z = cons(y, sole)
  x = "abc"
}

`)

  expect(output).toMatchSnapshot()
})
