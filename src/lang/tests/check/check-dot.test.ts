import { test } from "bun:test"
import { runCode } from "../utils"

test("check Dot", async () => {
  await runCode(`

let abc: class { a: String, b: String, c: String } = { a: "a", b: "b", c: "c" }

check abc.a: String
check abc.b: String
check abc.c: String

  `)
})
