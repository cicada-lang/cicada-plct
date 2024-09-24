import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("check the", async () => {
  await runCode(`

check the(Trivial, sole): Trivial

check the: (T: Type, T) -> T

`)
})

test("check the -- fail", async () => {
  await expectCodeToFail(`

check the(Trivial, "abc"): Trivial

`)
})
