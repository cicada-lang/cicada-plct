import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("check Clazz -- fulfilling type", async () => {
  await runCode(`

class The { T: Type, x: T }

check The(Type): Type
check The(Type, String): Type

check The(String): Type
check The(String, "abc"): Type

check The(Trivial): Type
check The(Trivial, sole): Type

check { T: String, x: "abc" }: The(String)
check { T: String, x: "abc" }: The(String, "abc")

`)
})

test("check Clazz -- fulfilling type -- wrong argument", async () => {
  await runCode(`

class ABC {
  a: String
  b: String
  c: String
}

let BC = ABC("a")

check { a: "a", b: "b", c: "c" }: ABC("a")

`)

  await expectCodeToFail(`

class ABC {
  a: String
  b: String
  c: String
}

let BC = ABC(Trivial)

`)
})

test("check Clazz -- fulfilling type -- fail", async () => {
  await expectCodeToFail(`

class The { T: Type, x: T }

check { T: String, x: "abc" }: The(Trivial)

`)

  await expectCodeToFail(`

class The { T: Type, x: T }

check { T: String, x: "abc" }: The(String, "xyz")

`)
})
