import { expect, test } from "vitest"
import { runCode } from "./utils"

test("compute Fn", async () => {
  const output = await runCode(`

let id: (T: Type, x: T) -> T = (T, x) => x
compute id
compute id(Type)

`)

  expect(output).toMatchInlineSnapshot(`
    "(T: Type, x: T) -> T: (T) => (x) => x
    (x: Type) -> Type: (x) => x"
  `)
})

test("compute Fn -- partial evaluation", async () => {
  const output = await runCode(`

let id: (T: Type, x: T) -> T = (T, x) => x

let id2: (T: Type, x: T) -> T = (T, x) => id(T, x)

compute id2
compute id2(Type)

`)

  expect(output).toMatchInlineSnapshot(`
    "(T: Type, x: T) -> T: (T) => (x) => x
    (x: Type) -> Type: (x) => x"
  `)
})
