import { test } from "vitest"
import { runCode } from "../utils"

test("check String is Type", async () => {
  await runCode(`

check String: Type

`)
})
