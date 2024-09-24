import { test } from "vitest"
import { runCode } from "../utils"

test("check Quote is String", async () => {
  await runCode(`

check "": String
check "abc": String

`)
})
