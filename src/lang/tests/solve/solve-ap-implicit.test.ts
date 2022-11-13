import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve ApImplicit -- same MetaVar", async () => {
  const output = await runCode(`

solve (id: (implicit T: Type, x: T) -> T, x: String) {
  id(x) = id(x)
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{
      id: TODO((implicit T2: Type, T2) -> T2),
      x: TODO(String)
    }"
  `,
  )
})

test("solve ApImplicit -- MetaVar v.s. String", async () => {
  const output = await runCode(`

solve (id: (implicit T: Type, x: T) -> T, x: String, A: Type) {
  id(implicit String, x) = id(implicit A, "abc")
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{
      id: TODO((implicit T: Type, T) -> T),
      x: \\"abc\\",
      A: String
    }"
  `,
  )
})

test("solve ApImplicit -- insertion", async () => {
  const output = await runCode(`

solve (id: (implicit T: Type, x: T) -> T, x: String) {
  id(x) = id("abc")
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{
      id: TODO((implicit T2: Type, T2) -> T2),
      x: \\"abc\\"
    }"
  `,
  )
})

test("solve ApImplicit -- deepWalk", async () => {
  const output = await runCode(`

solve (id: (implicit T: Type, x: T) -> T, A: Type, idA: (x: A) -> A) {
  idA = id(implicit A)
  A = String
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{
      id: TODO((implicit T: Type, T) -> T),
      A: String,
      idA: (x) => id(implicit String, x)
    }"
  `,
  )
})

test("solve ApImplicit -- deepWalk -- inserted", async () => {
  const output = await runCode(`

solve (id: (implicit T: Type, x: T) -> T, x: String, c: String) {
  c = id(x)
  id(x) = id("abc")
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{
      id: TODO((implicit T3: Type, T3) -> T3),
      x: \\"abc\\",
      c: id(implicit String, \\"abc\\")
    }"
  `,
  )
})
