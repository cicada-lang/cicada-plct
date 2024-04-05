import { test } from "bun:test"
import { expectCodeToFail, runCode } from "../utils"

test("check Ap", async () => {
  await runCode(`

let id: (T: Type, x: T) -> T = (T, x) => x
check id(Type, Type): Type

`)
})

test("check Ap -- dependent fail", async () => {
  await expectCodeToFail(`

let id: (T: Type, x: T) -> T = (T, x) => x
check id(Type, id): Type

`)
})

test("check Ap -- doAp can reduce id(Type, Type) to Type", async () => {
  await expectCodeToFail(`

let id: (T: Type, x: T) -> T = (T, x) => x
check id(Type, id): id(Type, Type)

`)
})
