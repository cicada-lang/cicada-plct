import { expect, test } from "vitest"
import { runCode } from "../utils"

test("unify Clazz", async () => {
  const output = await runCode(`

unify (A: Type, B: Type) {
  equation class { a: A, b: B } = class { a: String, b: String }
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("unify Clazz -- subclazz", async () => {
  const output = await runCode(`

unify (A: Type) {
  equation class { a: A } = class { a: String, b: String }
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String }"')
})

test("unify Clazz -- nested", async () => {
  const output = await runCode(`

unify (A: Type, B: Type) {
  equation class { c: class { a: A, b: B } } = class { c: class { a: String, b: String } }
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("unify Clazz -- occur twice", async () => {
  const output = await runCode(`

unify (A: Type, B: Type) {
  equation
    class { c: class { a: A, b: B }, b: String } =
    class { c: class { a: String, b: String }, b: B }
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})
