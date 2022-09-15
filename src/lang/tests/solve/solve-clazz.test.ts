import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Clazz", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  equation class { a: A, b: B } = class { a: String, b: String }
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve Clazz -- subclazz", async () => {
  const output = await runCode(`

solve (A: Type) {
  equation class { a: A } = class { a: String, b: String }
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String }"')
})

test("solve Clazz -- nested", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  equation class { c: class { a: A, b: B } } = class { c: class { a: String, b: String } }
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve Clazz -- occur twice", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  equation
    class { c: class { a: A, b: B }, b: String } =
    class { c: class { a: String, b: String }, b: B }
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})
