import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Fn", async () => {
  const output = await runCode(`

let id: (T: Type, x: T) -> T = (T, x) => x
compute id
compute id(Type)

`)

  expect(output).toMatchInlineSnapshot(`
    "(T, x) => x: (T: Type, T) -> T
    (x) => x: (Type) -> Type"
  `)
})

test("compute Fn -- freshen is necessary", async () => {
  const output = await runCode(`

// (lambda (x) ((lambda (f x) (f x)) x))
// with freshen:
//   (lambda (x1) (lambda (x) (x1 x)))
// without freshen:
//   (lambda (x) (lambda (x) (x x)))

function f(x: (Type) -> Type): (Type) -> Type {
  let f = x
  return the((Type) -> Type, (x) => f(x))
}

compute f

`)

  expect(output).toMatchInlineSnapshot('"(x, _) => x(_): ((Type) -> Type, Type) -> Type"')
})

test("compute Fn -- partial evaluation", async () => {
  const output = await runCode(`

let id: (T: Type, x: T) -> T = (T, x) => x

let id2: (T: Type, x: T) -> T = (T, x) => id(T, x)

compute id2
compute id2(Type)

`)

  expect(output).toMatchInlineSnapshot(`
    "(T, x) => x: (T: Type, T) -> T
    (x) => x: (Type) -> Type"
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
    "(T, x, f) => f(x): (T: Type, T, (T) -> T) -> T
    (x, f) => f(x): (Type, (Type) -> Type) -> Type
    (f) => f(Type): ((Type) -> Type) -> Type
    Type: Type"
  `)
})

test("compute Fn -- evaluation blocked by variable -- ApUnfolded", async () => {
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
    "(T, x, y, f) => f(x, y): (T: Type, T, T, (T, T) -> T) -> T
    (x, y, f) => f(x, y): (Type, Type, (Type, Type) -> Type) -> Type
    (y, f) => f(Type, y): (Type, (Type, Type) -> Type) -> Type
    (f) => f(Type, Type): ((Type, Type) -> Type) -> Type
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

  expect(output).toMatchInlineSnapshot('"(T, x) => x: (T: Type, T) -> T"')
})
