import { test } from "vitest"
import { runCode } from "../utils.js"

test("check Sole is Trivial", async () => {
  await runCode(`

check sole: Trivial

`)
})
