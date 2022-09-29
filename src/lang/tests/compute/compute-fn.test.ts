import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Fn", async () => {
  const output = await runCode(`

let id: (T: Type, x: T) -> T = (T, x) => x
compute id
compute id(Type)

`)

  expect(output).toMatchInlineSnapshot(`
    "(T2, x11) => x11: (T2: Type, x11: T2) -> T2
    (x2) => x2: (x2: Type) -> Type"
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
    "(T2, x11) => x11: (T2: Type, x11: T2) -> T2
    (x2) => x2: (x2: Type) -> Type"
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
    "(T2, x11, f11) => f11(x11): (T2: Type, x11: T2, f11: (_11: T2) -> T2) -> T2
    (x2, f11) => f11(x2): (x2: Type, f11: (_11: Type) -> Type) -> Type
    (f2) => f2(Type): (f2: (_2: Type) -> Type) -> Type
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
    "(T2, x11, y11, f11) => f11(x11, y11): (T2: Type, x11: T2, y11: T2, f11: (_21: T2, _111: T2) -> T2) -> T2
    (x2, y11, f11) => f11(x2, y11): (x2: Type, y11: Type, f11: (_21: Type, _111: Type) -> Type) -> Type
    (y2, f11) => f11(Type, y2): (y2: Type, f11: (_21: Type, _111: Type) -> Type) -> Type
    (f2) => f2(Type, Type): (f2: (_3: Type, _111: Type) -> Type) -> Type
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
    '"(T2, x11) => x11: (T2: Type, x11: T2) -> T2"',
  )
})
