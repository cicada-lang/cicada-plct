import { test } from "bun:test"
import { runCode } from "../utils"

test("check Quote is String", async () => {
  await runCode(`

check "": String
check "abc": String

`)
})
