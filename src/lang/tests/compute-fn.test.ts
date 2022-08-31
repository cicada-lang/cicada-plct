import { test } from "vitest"
import { runCode } from "./utils"

test("compute Fn", async () => {
  await runCode(`

let id: (T: Type, x: T) -> T = (T, x) => x
compute id
compute id(Type)

`)
})

test("compute Fn -- partial evaluation", async () => {
  await runCode(`

let id: (T: Type, x: T) -> T = (T, x) => x

let id2: (T: Type, x: T) -> T = (T, x) => id(T, x)

compute id2
compute id2(Type)

`)
})
