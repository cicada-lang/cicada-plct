import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Ap -- same MetaVar", async () => {
  const output = await runCode(`

solve (f: (String) -> String, x: String) {
  f(x) = f(x)
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{
      f: TODO((String) -> String),
      x: TODO(String)
    }"
  `,
  )
})

test("solve Ap -- MetaVar v.s. String", async () => {
  const output = await runCode(`

solve (f: (String) -> String, x: String) {
  f(x) = f("abc")
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{
      f: TODO((String) -> String),
      x: \\"abc\\"
    }"
  `,
  )
})

test("solve Ap -- deepWalk", async () => {
  const output = await runCode(`

solve (f: (String) -> String, x: String, c: String) {
  c = f(x)
  f(x) = f("abc")
}

`)

  expect(output).toMatchInlineSnapshot(
    `
    "{
      f: TODO((String) -> String),
      x: \\"abc\\",
      c: f(\\"abc\\")
    }"
  `,
  )
})
