import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("check Clazz is a Type", async () => {
  await runCode(`

check class { T: Type, x: T }: Type
check class { a: String, b: String = "b", c: String }: Type

`)
})

test("check Clazz -- doAp", async () => {
  await runCode(`

class The { T: Type, x: T }
check The(String): Type
check { T: String, x: "x" }: The(String)

`)
})

test("check Clazz -- doAp fail", async () => {
  await expectCodeToFail(`

class The { T: Type, x: T }
check { T: String, x: "x" }: The(Type)

`)
})

test("check Clazz -- doAp parameter does not match type", async () => {
  await expectCodeToFail(`

class ABC {
  a: String
  b: String
  c: String
}
let BC = ABC(Type)

`)
})
