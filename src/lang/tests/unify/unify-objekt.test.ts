import { expect, test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("unify Objekt", async () => {
  const output = await runCode(`

class ABC {
  a: String
  b: String
  c: String
}

unify (a: String, b: String, c: String) {
  equation { a, b, c } = { a: "a", b: "b", c: "c" } : ABC
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ a: \\"a\\", b: \\"b\\", c: \\"c\\" }"',
  )
})

test("unify Objekt -- occur twice", async () => {
  const output = await runCode(`

class ABC {
  a: String
  b: String
  c: String
}

unify (a: String, b: String) {
  equation { a, b, c: b } = { a: b, b: "c", c: "c" } : ABC
}

`)

  expect(output).toMatchInlineSnapshot('"{ a: \\"c\\", b: \\"c\\" }"')
})

test("unify Objekt -- extra common properties", async () => {
  await expectCodeToFail(`

class AB {
  a: String
  b: String
}

unify (a: String, b: String, c: String) {
  equation { a, b, c } = { a: b, b: "c", c: "c" } : AB
}

`)
})
