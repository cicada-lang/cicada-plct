import { expect, test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("compute Fn with return type", async () => {
  const output = await runCode(`

let id = function (T: Type, x: T): T { return x }
compute id
compute id(Type)

`)

  expect(output).toMatchInlineSnapshot(`
    "(T1, x1) => x1: (T1: Type, x1: T1) -> T1
    (x1) => x1: (x1: Type) -> Type"
  `)
})

test("compute Fn with return type -- conflict", async () => {
  const output = await expectCodeToFail(`

let id = function (x: String): Type { return x }

  `)
})

test("compute Fn return type -- stmts", async () => {
  const output = await runCode(`

function id(T: Type, x: T): T { 
  return x 
}

compute id

`)

  expect(output).toMatchInlineSnapshot(
    '"(T1, x1) => x1: (T1: Type, x1: T1) -> T1"',
  )
})
