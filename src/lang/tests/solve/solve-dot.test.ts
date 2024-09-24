import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Dot", async () => {
  const output = await runCode(`

class ABC {
  a: String
  b: String
  c: String
}

solve (abc: ABC, a: String, b: String, c: String) {
  a = abc.a
  b = abc.b
  c = abc.c
  abc = { a: "a", b: "b", c: "c" }
}

`)

  expect(output).toMatchSnapshot()
})
