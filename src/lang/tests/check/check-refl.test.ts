import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("check Equal", async () => {
  await runCode(`

check refl: Equal(String, "abc", "abc")

`)
})

test("check Equal -- fail", async () => {
  await expectCodeToFail(`

check refl: Equal(String, "abc", "123")

`)
})

test("check Equal -- given implicit", async () => {
  await runCode(`

check refl(implicit String, implicit "abc"): Equal(String, "abc", "abc")

`)
})

test("check Equal -- given implicit -- fail", async () => {
  await expectCodeToFail(`

check refl(implicit String, implicit "abc"): Equal(String, "abc", "123")

`)
})
