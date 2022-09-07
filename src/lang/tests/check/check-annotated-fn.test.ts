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

test("check AnnotatedFn -- dependent -- check by infer", async () => {
  await runCode(`

check (T, x) => x: forall (T: Type, x: T) T

check (T: Type, x: T) => x: forall (T: Type, x: T) T

`)
})
