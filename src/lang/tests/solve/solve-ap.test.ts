import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Ap", async () => {
  const output = await runCode(`

solve (f: (String) -> String, x: String) {
  equation f(x) = f(x)
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ f: TODO((_: String) -> String), x: TODO(String) }"',
  )
})
