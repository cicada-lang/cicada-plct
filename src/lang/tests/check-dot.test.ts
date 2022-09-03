import { test } from "vitest"
import { runCode } from "./utils"

test.todo("check Dot", async () => {
  await runCode(`

let obj: class { a: String, b: String } = { a: "a", b: "b" }
check obj.a: String
  `)
})
