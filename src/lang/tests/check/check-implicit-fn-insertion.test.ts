import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("check FnImplicit -- no FnImplicit insertion", async () => {
  await expectCodeToFail(`

let id: (implicit T: Type, x: T) -> T = (x) => x

`)
})

test("check FnImplicit", async () => {
  await runCode(`

let id: (implicit T: Type, x: T) -> T = (implicit T, x) => x

`)
})
