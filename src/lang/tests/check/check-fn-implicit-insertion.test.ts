import { test } from "vitest"
import { runCode } from "../utils.js"

test("check FnImplicit -- FnImplicit insertion", async () => {
  await runCode(`

let id: (implicit T: Type, x: T) -> T = (x) => x

`)
})

test("check FnImplicit", async () => {
  await runCode(`

let id: (implicit T: Type, x: T) -> T = (implicit T, x) => x

`)
})
