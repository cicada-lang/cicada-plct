import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Sequence -- single return", async () => {
  const output = await runCode(`

compute begin {
  return sole
}

`)

  expect(output).toMatchInlineSnapshot('"sole: Trivial"')
})

test("compute Sequence -- Let", async () => {
  const output = await runCode(`

compute begin {
  let x = sole
  return x
}

`)

  expect(output).toMatchInlineSnapshot('"sole: Trivial"')
})

test.todo("compute Sequence -- LetThe", async () => {
  const output = await runCode(`

compute begin {
  let x: Trivial = sole
  return x
}

`)

  expect(output).toMatchInlineSnapshot()
})

test.todo("compute Sequence -- Check", async () => {
  const output = await runCode(`

compute begin {
  check sole: Trivial
  return sole
}

`)

  expect(output).toMatchInlineSnapshot()
})
