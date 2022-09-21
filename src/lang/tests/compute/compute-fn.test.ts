import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Fn", async () => {
  const output = await runCode(`

let id: (T: Type, x: T) -> T = (T, x) => x
compute id
compute id(Type)

`)

  expect(output).toMatchInlineSnapshot(`
    "(T, x) => x: (T: Type, x: T) -> T
    (x1) => x1: (x1: Type) -> Type"
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
    "(T, x) => x: (T: Type, x: T) -> T
    (x1) => x1: (x1: Type) -> Type"
  `)
})

test("compute Fn -- evaluation blocked by variable", async () => {
  const output = await runCode(`

let apply: (T: Type, x: T, f: (T) -> T) -> T =
  (T, x, f) => f(x)

compute apply
compute apply(Type)
compute apply(Type, Type)
compute apply(Type, Type, (x) => x)

`)

  expect(output).toMatchInlineSnapshot(`
    "(T, x, f) => f(x): (T: Type, x: T, f: (_: T) -> T) -> T
    (x1, f1) => f1(x1): (x1: Type, f1: (_1: Type) -> Type) -> Type
    (f2) => f2(Type): (f2: (_2: Type) -> Type) -> Type
    Type: Type"
  `)
})

test("compute Fn -- evaluation blocked by variable -- FoldedAp", async () => {
  const output = await runCode(`

let apply2: (T: Type, x: T, y: T, f: (T, T) -> T) -> T =
  (T, x, y, f) => f(x, y)

compute apply2
compute apply2(Type)
compute apply2(Type, Type)
compute apply2(Type, Type, Type)
compute apply2(Type, Type, Type, (x, y) => x)

`)

  expect(output).toMatchInlineSnapshot(`
    "(T, x, y, f) => f(x, y): (T: Type, x: T, y: T, f: (_: T, _1: T) -> T) -> T
    (x1, y1, f1) => f1(x1, y1): (x1: Type, y1: Type, f1: (_2: Type, _3: Type) -> Type) -> Type
    (y2, f2) => f2(Type, y2): (y2: Type, f2: (_4: Type, _5: Type) -> Type) -> Type
    (f3) => f3(Type, Type): (f3: (_6: Type, _7: Type) -> Type) -> Type
    Type: Type"
  `)
})

test("compute Fn -- stmts", async () => {
  const output = await runCode(`

function id(T: Type, x: T) { 
  return x 
}

compute id

`)

  expect(output).toMatchInlineSnapshot(`
    "(T, x) => x: (T: Type, x: T) -> T"
  `)
})
