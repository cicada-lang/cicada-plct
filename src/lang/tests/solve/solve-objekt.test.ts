import { expect, test } from "vitest"
import { runCode } from "../utils"

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
