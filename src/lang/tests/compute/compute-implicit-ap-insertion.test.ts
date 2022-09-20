import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute ImplicitAp -- insertion -- id", async () => {
  const output = await runCode(`

function id(implicit T: Type, x: T): T {
  return x
}

// compute id(sole)
compute id("abc")

`)

  // TODO fix for sole

  expect(output).toMatchInlineSnapshot('"\\"abc\\": String"')
})

test("compute ImplicitAp -- insertion -- infer", async () => {
  const output = await runCode(`

function infer(implicit T: Type, x: T): Type {
  return T
}

// compute infer(sole)
compute infer("abc")

`)

  // TODO fix for sole

  expect(output).toMatchInlineSnapshot('"String: Type"')
})

test("compute ImplicitAp -- insertion -- infer2", async () => {
  const output = await runCode(`

function infer2(implicit A: Type, implicit B: Type, x: A, y: B): Type {
  return Pair(A, B)
}

// compute infer2(sole, "abc")
// compute infer2(sole, sole)
// compute infer2("abc")(sole)
compute infer2("abc")("abc")

`)

  expect(output).toMatchInlineSnapshot()
})

test("compute ImplicitAp -- insertion -- infer2 -- over", async () => {
  const output = await runCode(`

function infer2(implicit A: Type, x: A, implicit B: Type, y: B): Type {
  return Pair(A, B)
}

// compute infer2(sole, "abc")
// compute infer2(sole, sole)
// compute infer2("abc")(sole)
compute infer2("abc")("abc")

`)

  expect(output).toMatchInlineSnapshot('"exists (String) String: Type"')
})

test("compute ImplicitAp -- insertion -- inferReturnType", async () => {
  const output = await runCode(`

function inferReturnType(implicit A: Type, implicit B: Type, x: (A) -> B): Type {
  return B
}

function stringToTrivial(_: String): Trivial {
  return sole
}

compute inferReturnType(stringToTrivial)

function id(implicit T: Type, x: T): T {
  return x
}

compute inferReturnType(id(implicit String))

`)

  expect(output).toMatchInlineSnapshot(`
    "Trivial: Type
    String: Type"
  `)
})

test("compute ImplicitAp -- insertion -- deepWalk required", async () => {
  const output = await runCode(`

function Box(T: Type): Type {
  return Pair(T, Trivial)
}

function box(implicit T: Type, x: T): Box(T) {
  return cons(x, sole)
}

compute box("abc")
compute cons("abc", sole)

`)

  expect(output).toMatchInlineSnapshot(
    `
    "cons(\\"abc\\", sole): exists (String) Trivial
    cons(\\"abc\\", sole): exists (String) Trivial"
  `,
  )
})
