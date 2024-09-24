import { test } from "vitest"
import { runCode } from "../utils.js"

test("check Sigma is a Type", async () => {
  await runCode(`

check exists (n: Type) Type: Type

`)
})

test("check Sigma is a Type -- dependent", async () => {
  await runCode(`

check exists (T: Type) T: Type

`)
})

test("check Sigma is a Type -- nameless", async () => {
  await runCode(`

check exists (Type) Type: Type

`)
})
