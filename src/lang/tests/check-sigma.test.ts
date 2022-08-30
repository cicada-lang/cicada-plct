import { test } from "vitest"
import { expectCodeToRun } from "./utils"

test("check Sigma is a Type", async () => {
  await expectCodeToRun(`

check exists (n: Type) Type: Type

`)
})

test("check Sigma is a Type -- dependent", async () => {
  await expectCodeToRun(`

check exists (T: Type) T: Type

`)
})

test("check Sigma is a Type -- nameless", async () => {
  await expectCodeToRun(`

check exists (Type) Type: Type

`)
})