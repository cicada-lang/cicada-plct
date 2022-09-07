import { test } from "vitest"
import { runCode } from "../utils"

test("check AnnotatedFn", async () => {
  await runCode(`

check (T: Type) => T: (Type) -> Type

`)
})

test("check AnnotatedFn -- dependent", async () => {
  await runCode(`

let id = (T: Type, x: T) => x

`)
})
