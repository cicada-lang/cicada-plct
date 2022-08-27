import { test } from "vitest"
import { expectCodeToRun } from "./utils"

test("check Ap", async () => {
  await expectCodeToRun(`

let id: (T: Type, x: T) -> T = (T, x) => x
check id(Type): Type

`)
})
