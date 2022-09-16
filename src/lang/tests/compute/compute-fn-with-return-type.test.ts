import { expect, test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("compute Fn with return type", async () => {
  const output = await runCode(`

let id = function (T: Type, x: T): T x
compute id
compute id(Type)

`)

  expect(output).toMatchInlineSnapshot(`
    "(T, x) => x: (T: Type, x: T) -> T
    (x) => x: (x: Type) -> Type"
  `)
})

test("compute Fn with return type -- conflict", async () => {
  const output = await expectCodeToFail(`

let id = function (x: String): Type x

  `)
})

test("compute Fn return type -- stmts", async () => {
  const output = await runCode(`

function id(T: Type, x: T): T { 
  return x 
}

compute id

`)

  expect(output).toMatchInlineSnapshot(`
    "(T, x) => x: (T: Type, x: T) -> T"
  `)
})
