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
  equation { a, b, c } = { a: "a", b: "b", c: "c" } : ABC
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ a: \\"a\\", b: \\"b\\", c: \\"c\\" }"',
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
  equation { a, b, c: b } = { a: b, b: "c", c: "c" } : ABC
}

`)

  expect(output).toMatchInlineSnapshot('"{ a: b, b: \\"c\\" }"')
})

test("solve Objekt -- extra common properties", async () => {
  await expectCodeToFail(`

class AB {
  a: String
  b: String
}

solve (a: String, b: String, c: String) {
  equation { a, b, c } = { a: b, b: "c", c: "c" } : AB
}

`)
})
