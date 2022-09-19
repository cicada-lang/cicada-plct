import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("check ImplicitFn -- no insertion for ImplicitFn", async () => {
  await expectCodeToFail(`

let id: (implicit T: Type, x: T) -> T = (x) => x

`)

  await runCode(`

let id: (implicit T: Type, x: T) -> T = (implicit T, x) => x

`)
})
