import { test } from "vitest"
import { runCode } from "../utils"

test("check PiImplicit is a Type", async () => {
  await runCode(`

check (implicit T: Type, x: T) -> Type: Type

`)
})
