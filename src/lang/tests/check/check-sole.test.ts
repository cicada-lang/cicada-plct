import { test } from "vitest"
import { runCode } from "../utils"

test("check Sole is Trivial", async () => {
  await runCode(`

check sole: Trivial

`)
})
