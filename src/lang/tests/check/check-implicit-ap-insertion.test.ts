import { test } from "vitest"
import { runCode } from "../utils"

test("check ImplicitAp -- insertion", async () => {
  await runCode(`

let id: (implicit T: Type, x: T) -> T = (x) => x

check id(sole): Trivial
check id("abc"): String

let infer: (implicit T: Type, x: T) -> Type = (implicit T, x) => T

check infer(sole): Type
check infer("abc"): Type

`)
})
