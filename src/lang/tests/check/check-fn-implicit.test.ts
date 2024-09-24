import { test } from "vitest"
import { runCode } from "../utils.js"

test("check FnImplicit", async () => {
  await runCode(`

check (implicit T, x) => T: (implicit T: Type, x: T) -> Type

`)
})
