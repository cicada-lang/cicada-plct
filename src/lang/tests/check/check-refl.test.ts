import { test } from "bun:test"
import { expectCodeToFail, runCode } from "../utils"

test("check Refl", async () => {
  await runCode(`

check refl: Equal(String, "abc", "abc")

`)
})

test("check Refl -- fail", async () => {
  await expectCodeToFail(`

check refl: Equal(String, "abc", "123")

`)
})

test("check Refl -- given implicit", async () => {
  await runCode(`

check refl(implicit String, implicit "abc"): Equal(String, "abc", "abc")

`)
})

test("check Refl -- given implicit -- fail", async () => {
  await expectCodeToFail(`

check refl(implicit String, implicit "abc"): Equal(String, "abc", "123")

`)
})
