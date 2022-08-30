import { test } from "vitest"
import { expectCodeToRun } from "./utils"

test("compute Pi", async () => {
  await expectCodeToRun(`

compute (T: Type, x: T) -> T

`)
})
