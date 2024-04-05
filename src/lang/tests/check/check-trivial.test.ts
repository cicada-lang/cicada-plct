import { test } from "bun:test"
import { runCode } from "../utils"

test("check Trivial is Type", async () => {
  await runCode(`

check Trivial: Type

`)
})
