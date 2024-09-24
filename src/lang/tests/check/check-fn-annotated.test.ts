import { test } from "vitest"
import { runCode } from "../utils.js"

test("check FnAnnotated", async () => {
  await runCode(`

check (T: Type) => T: (Type) -> Type

`)
})

test("check FnAnnotated -- dependent", async () => {
  await runCode(`

let id = (T: Type, x: T) => x

`)
})

test("check FnAnnotated -- dependent -- check by infer", async () => {
  await runCode(`

check (T, x) => x: forall (T: Type, x: T) T
check (T, y) => y: forall (T: Type, x: T) T

check (T: Type, x: T) => x: forall (T: Type, x: T) T
check (T: Type, y: T) => y: forall (T: Type, x: T) T

`)
})
