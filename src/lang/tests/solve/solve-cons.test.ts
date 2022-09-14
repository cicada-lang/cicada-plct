import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Cons -- car", async () => {
  const output = await runCode(`

solve (a: String) {
  equation cons(a, "b") = cons("a", "b")
}

`)

  expect(output).toMatchInlineSnapshot('"{ a: \\"a\\" }"')
})
