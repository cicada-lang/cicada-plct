import { expect, test } from "vitest"
import { runCode } from "../utils.js"

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

  expect(output).toMatchSnapshot()
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

  expect(output).toMatchSnapshot()
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

  expect(output).toMatchSnapshot()
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

  expect(output).toMatchSnapshot()
})
