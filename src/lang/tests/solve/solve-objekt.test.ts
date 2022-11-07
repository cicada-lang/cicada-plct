import { expect, test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("solve Objekt", async () => {
  const output = await runCode(`

class ABC {
  a: String
  b: String
  c: String
}

solve (a: String, b: String, c: String) {
  { a, b, c } = { a: "a", b: "b", c: "c" }
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{
      a: \\"a\\",
      b: \\"b\\",
      c: \\"c\\"
    }"
  `,
  )
})

test("solve Objekt -- occur twice", async () => {
  const output = await runCode(`

class ABC {
  a: String
  b: String
  c: String
}

solve (a: String, b: String) {
  { a, b, c: b } = { a: b, b: "c", c: "c" }
}

`)

  expect(output).toMatchInlineSnapshot(`
    "{
      a: \\"c\\",
      b: \\"c\\"
    }"
  `)
})

test("solve Objekt -- extra common properties", async () => {
  await expectCodeToFail(`

class AB {
  a: String
  b: String
}

solve (a: String, b: String, c: String) {
  { a, b, c } = { a: b, b: "c", c: "c" } : AB
}

`)
})

test("solve Objekt -- deepWalk", async () => {
  const output = await runCode(`

class ABC {
  a: String
  b: String
  c: String
}

solve (a: String, b: String, c: String, abc: ABC) {
  abc = { a, b, c }
  { a, b, c } = { a: "a", b: "b", c: "c" }
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{
      a: \\"a\\",
      b: \\"b\\",
      c: \\"c\\",
      abc: {
        a: \\"a\\",
        b: \\"b\\",
        c: \\"c\\"
      }
    }"
  `,
  )
})
