import { test } from "vitest"
import { runCode } from "../utils"

test("check ImplicitFn", async () => {
  await runCode(`

check (implicit T, x) => T: (implicit T: Type, x: T) -> Type

`)
})
