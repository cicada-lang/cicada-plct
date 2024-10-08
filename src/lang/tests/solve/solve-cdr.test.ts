import { expect, test } from "vitest"
import { runCode } from "../utils.js"

test("solve Cdr", async () => {
  const output = await runCode(`

solve (ab: Pair(String, String), b: String) {
  b = cdr(ab)
  ab = cons("a", "b")
}

`)

  expect(output).toMatchSnapshot()
})
