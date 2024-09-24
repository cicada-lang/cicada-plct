import { test } from "vitest"
import { runCode } from "../utils.js"

test("check String is Type", async () => {
  await runCode(`

check String: Type

`)
})
