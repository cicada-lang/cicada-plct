import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Cdr", async () => {
  const output = await runCode(`

solve (ab: Pair(String, String), b: String) {
  b = cdr(ab)
  ab = cons("a", "b")
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{
      ab: cons(\\"a\\", \\"b\\"),
      b: \\"b\\"
    }"
  `,
  )
})
