import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute ApImplicit -- insertion -- id", async () => {
  const output = await runCode(`

function id(implicit T: Type, x: T): T {
  return x
}

compute id(sole)
compute id("abc")

`)

  expect(output).toMatchInlineSnapshot(`
    "sole: Trivial
    \\"abc\\": String"
  `)
})

test("compute ApImplicit -- insertion -- infer", async () => {
  const output = await runCode(`

function infer(implicit T: Type, x: T): Type {
  return T
}

compute infer(sole)
compute infer("abc")

`)

  expect(output).toMatchInlineSnapshot(`
    "Trivial: Type
    String: Type"
  `)
})

test("compute ApImplicit -- insertion -- infer2", async () => {
  const output = await runCode(`

function infer2(implicit A: Type, implicit B: Type, x: A, y: B): Type {
  return Pair(A, B)
}

compute infer2(sole, "abc")
compute infer2(sole, sole)
compute infer2("abc")(sole)
compute infer2("abc")("abc")

`)

  expect(output).toMatchInlineSnapshot(`
    "Pair(Trivial, String): Type
    Pair(Trivial, Trivial): Type
    Pair(String, Trivial): Type
    Pair(String, String): Type"
  `)
})

test("compute ApImplicit -- insertion -- infer2 -- over", async () => {
  const output = await runCode(`

function infer2(implicit A: Type, x: A, implicit B: Type, y: B): Type {
  return Pair(A, B)
}

compute infer2(sole, "abc")
compute infer2(sole, sole)
compute infer2("abc")(sole)
compute infer2("abc")("abc")

`)

  expect(output).toMatchInlineSnapshot(`
    "Pair(Trivial, String): Type
    Pair(Trivial, Trivial): Type
    Pair(String, Trivial): Type
    Pair(String, String): Type"
  `)
})

test("compute ApImplicit -- insertion -- inferReturnType", async () => {
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

test("compute ApImplicit -- insertion -- deepWalk required", async () => {
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
    "cons(\\"abc\\", sole): Pair(String, Trivial)
    cons(\\"abc\\", sole): Pair(String, Trivial)"
  `,
  )
})

test("compute ApImplicit -- insertion -- nested", async () => {
  const output = await runCode(`

function Box(T: Type): Type {
  return Pair(T, Trivial)
}

function box(implicit T: Type, x: T): Box(T) {
  return cons(x, sole)
}

compute box(box("abc"))
compute box(box(box("abc")))

`)

  expect(output).toMatchInlineSnapshot(`
    "cons(cons(\\"abc\\", sole), sole): Pair(Pair(String, Trivial), Trivial)
    cons(cons(cons(\\"abc\\", sole), sole), sole): Pair(Pair(Pair(String, Trivial), Trivial), Trivial)"
  `)
})

test("compute ApImplicit -- insertion -- during check", async () => {
  const output = await runCode(`

function idWithTrivial(implicit T: Type, solo: Trivial, x: T): T {
  return x
}


check idWithTrivial(sole): (String) -> String

let idString: (String) -> String = idWithTrivial(sole)
compute idString

`)

  expect(output).toMatchInlineSnapshot('"(_) => _: (String) -> String"')
})
