import { test } from "bun:test"
import { runCode } from "../utils"

test("check PiImplicit is a Type", async () => {
  await runCode(`

check (implicit T: Type, x: T) -> Type: Type

`)
})
