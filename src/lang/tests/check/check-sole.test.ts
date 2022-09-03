import { test } from "vitest"
import { runCode } from "../utils"

test("check sole is Trivial", async () => {
  await runCode(`

check sole: Trivial

`)
})
