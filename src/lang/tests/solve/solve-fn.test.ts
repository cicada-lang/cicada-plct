import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Fn", async () => {
  const output = await runCode(`

solve (x: String) {
  equation (_: Trivial) => x = (_: Trivial) => "abc"
}

`)

  expect(output).toMatchInlineSnapshot('"{ x: \\"abc\\" }"')
})
