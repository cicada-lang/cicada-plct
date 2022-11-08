import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute New", async () => {
  const output = await runCode(`

class ABC {
  a: String
  b: String
  c: String
}

compute new ABC {
  a: "a",
  b: "b",
  c: "c",
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{
      a: \\"a\\",
      b: \\"b\\",
      c: \\"c\\"
    }: class {
      a: String = \\"a\\"
      b: String = \\"b\\"
      c: String = \\"c\\"
    }"
  `,
  )
})

test("compute New -- fulfilled", async () => {
  const output = await runCode(`

class AB {
  a: String
  b: String = a
}

compute new AB {
  a: "Hello, World!",
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{
      a: \\"Hello, World!\\",
      b: \\"Hello, World!\\"
    }: class {
      a: String = \\"Hello, World!\\"
      b: String = \\"Hello, World!\\"
    }"
  `,
  )
})

test("compute New -- dependent", async () => {
  const output = await runCode(`

class The {
  T: Type
  x: T
}

compute new The {
  T: String,
  x: "x",
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{
      T: String,
      x: \\"x\\"
    }: class {
      T: Type = String
      x: String = \\"x\\"
    }"
  `,
  )
})

test("compute New -- extra properties", async () => {
  const output = await runCode(`

class ABC {
  a: String
  b: String
  c: String
}

compute new ABC {
  a: "a",
  b: "b",
  c: "c",
  d: "d",
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{
      a: \\"a\\",
      b: \\"b\\",
      c: \\"c\\",
      d: \\"d\\"
    }: class {
      a: String = \\"a\\"
      b: String = \\"b\\"
      c: String = \\"c\\"
      d: String = \\"d\\"
    }"
  `,
  )
})
