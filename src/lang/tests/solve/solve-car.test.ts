import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Car", async () => {
  const output = await runCode(`

solve (ab: Pair(String, String), x: String) {
  unify x = car(ab)
  unify ab = cons("a", "b")
}

`)

  expect(output).toMatchInlineSnapshot('"{ ab: cons(\\"a\\", \\"b\\"), x: car(ab) }"')
})
