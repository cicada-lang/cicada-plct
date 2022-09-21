import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Fn", async () => {
  const output = await runCode(`

let id: (T: Type, x: T) -> T = (T, x) => x
compute id
compute id(Type)

`)

  expect(output).toMatchInlineSnapshot(`
    "(T1, x1) => x1: (T1: Type, x1: T1) -> T1
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
    "(T1, x1) => x1: (T1: Type, x1: T1) -> T1
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
    "(T1, x1, f1) => f1(x1): (T1: Type, x1: T1, f1: (_1: T1) -> T1) -> T1
    (x1, f1) => f1(x1): (x1: Type, f1: (_1: Type) -> Type) -> Type
    (f1) => f1(Type): (f1: (_1: Type) -> Type) -> Type
    Type: Type"
  `)
})

test("compute Fn -- evaluation blocked by variable -- ApFolded", async () => {
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
    "(T1, x1, y1, f1) => f1(x1, y1): (T1: Type, x1: T1, y1: T1, f1: (_2: T1, _11: T1) -> T1) -> T1
    (x1, y1, f1) => f1(x1, y1): (x1: Type, y1: Type, f1: (_2: Type, _11: Type) -> Type) -> Type
    (y1, f1) => f1(Type, y1): (y1: Type, f1: (_2: Type, _11: Type) -> Type) -> Type
    (f1) => f1(Type, Type): (f1: (_2: Type, _11: Type) -> Type) -> Type
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

  expect(output).toMatchInlineSnapshot(
    '"(T1, x1) => x1: (T1: Type, x1: T1) -> T1"',
  )
})
