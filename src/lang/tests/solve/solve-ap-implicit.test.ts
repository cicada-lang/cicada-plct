import { expect, test } from "vitest"
import { runCode } from "../utils.js"

test("solve ApImplicit -- same PatternVar", async () => {
  const output = await runCode(`

solve (id: (implicit T: Type, x: T) -> T, x: String) {
  id(x) = id(x)
}

`)

  expect(output).toMatchSnapshot()
})

test("solve ApImplicit -- PatternVar v.s. String", async () => {
  const output = await runCode(`

solve (id: (implicit T: Type, x: T) -> T, x: String, A: Type) {
  id(implicit String, x) = id(implicit A, "abc")
}

`)

  expect(output).toMatchSnapshot()
})

test("solve ApImplicit -- insertion", async () => {
  const output = await runCode(`

solve (id: (implicit T: Type, x: T) -> T, x: String) {
  id(x) = id("abc")
}

`)

  expect(output).toMatchSnapshot()
})

test("solve ApImplicit -- deepWalk", async () => {
  const output = await runCode(`

solve (id: (implicit T: Type, x: T) -> T, A: Type, idA: (x: A) -> A) {
  idA = id(implicit A)
  A = String
}

`)

  expect(output).toMatchSnapshot()
})

test("solve ApImplicit -- deepWalk -- inserted", async () => {
  const output = await runCode(`

solve (id: (implicit T: Type, x: T) -> T, x: String, c: String) {
  c = id(x)
  id(x) = id("abc")
}

`)

  expect(output).toMatchSnapshot()
})
