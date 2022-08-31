import { test } from "vitest"
import { runCode } from "./utils"

test("compute Pi", async () => {
  await runCode(`

compute (T: Type, x: T) -> T

`)
})
