import { expect, test } from "bun:test"
import { runCode } from "../utils"

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
