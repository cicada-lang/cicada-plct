import { test } from "vitest"
import { runCode } from "../utils.js"

test("check PiImplicit is a Type", async () => {
  await runCode(`

check (implicit T: Type, x: T) -> Type: Type

`)
})
