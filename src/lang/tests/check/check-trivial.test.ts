import { test } from "vitest"
import { runCode } from "../utils.js"

test("check Trivial is Type", async () => {
  await runCode(`

check Trivial: Type

`)
})
