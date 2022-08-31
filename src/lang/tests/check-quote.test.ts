import { test } from "vitest"
import { runCode } from "./utils"

test("check quote is String", async () => {
  await runCode(`

check "": String
check "abc": String

`)
})
