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
    (x) => x: (x: Type) -> Type"
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
    (x) => x: (x: Type) -> Type"
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
    (x, f) => f(x): (x: Type, f: (_: Type) -> Type) -> Type
    (f) => f(Type): (f: (_: Type) -> Type) -> Type
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
    (x, y, f) => f(x, y): (x: Type, y: Type, f: (_: Type, _1: Type) -> Type) -> Type
    (y, f) => f(Type, y): (y: Type, f: (_: Type, _1: Type) -> Type) -> Type
    (f) => f(Type, Type): (f: (_: Type, _1: Type) -> Type) -> Type
    Type: Type"
  `)
})
