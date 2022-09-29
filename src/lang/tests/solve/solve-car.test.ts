import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Car", async () => {
  const output = await runCode(`

solve (ab: Pair(String, String), a: String) {
  unify a = car(ab)
  unify ab = cons("a", "b")
}

`)

  expect(output).toMatchInlineSnapshot('"{ ab: cons(\\"a\\", \\"b\\"), a: car(ab) }"')
})
