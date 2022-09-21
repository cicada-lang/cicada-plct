import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("check ImplicitFn -- no ImplicitFn insertion", async () => {
  await expectCodeToFail(`

let id: (implicit T: Type, x: T) -> T = (x) => x

`)
})

test("check ImplicitFn", async () => {
  await runCode(`

let id: (implicit T: Type, x: T) -> T = (implicit T, x) => x

`)
})
