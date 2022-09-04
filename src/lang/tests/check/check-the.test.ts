import { test } from "vitest"
import { runCode } from "../utils"

test("check the", async () => {
  await runCode(`

check the(Trivial, sole): Trivial

check the: (T: Type, T) -> T

`)
})
