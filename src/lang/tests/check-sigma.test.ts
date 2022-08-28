import { test } from "vitest"
import { expectCodeToRun } from "./utils"

test("check Sigma is a Type", async () => {
  await expectCodeToRun(`

check exists (n: Type) Type: Type

`)
})
