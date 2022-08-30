import { test } from "vitest"
import { expectCodeToRun } from "./utils"

test("compute Fn", async () => {
  await expectCodeToRun(`

let id: (T: Type, x: T) -> T = (T, x) => x
compute id

`)
})
