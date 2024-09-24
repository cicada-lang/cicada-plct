import { test } from "vitest"
import { runCode } from "../utils.js"

test("check Clazz is a Type", async () => {
  await runCode(`

check class { T: Type, x: T }: Type
check class { a: String, b: String = "b", c: String }: Type

`)
})
