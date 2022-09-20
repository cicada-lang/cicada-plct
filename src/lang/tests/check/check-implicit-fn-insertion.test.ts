import { test } from "vitest"
import { runCode } from "../utils"

test("check FnImplicit -- insertion", async () => {
  await runCode(`

let id: (implicit T: Type, x: T) -> T = (x) => x

`)

  await runCode(`

let id: (implicit T: Type, x: T) -> T = (implicit T, x) => x

`)
})
