import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("solve Quote -- data", async () => {
  const output = await runCode(`

solve () {
  "a" = "a"
  "b" = "b"
  "c" = "c"
}

`)

  expect(output).toMatchSnapshot()
})

test("solve Quote -- bindings", async () => {
  const output = await runCode(`

solve (a: String, b: String, c: String) {
  a = "a"
  b = "b"
  c = "c"
}

`)

  expect(output).toMatchSnapshot()
})

test("solve Quote -- walk", async () => {
  const output = await runCode(`

solve (a: String, b: String, c: String) {
  a = b
  b = c
  a = "a"
}

`)

  expect(output).toMatchSnapshot()
})
