import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Sequence -- single return", async () => {
  const output = await runCode(`

compute {
  return sole
}

`)

  expect(output).toMatchSnapshot()
})

test("compute Sequence -- Let", async () => {
  const output = await runCode(`

compute {
  let x = sole
  return x
}

`)

  expect(output).toMatchSnapshot()
})

test("compute Sequence -- LetThe", async () => {
  const output = await runCode(`

compute {
  let x: Trivial = sole
  return x
}

`)

  expect(output).toMatchSnapshot()
})

test("compute Sequence -- Check", async () => {
  const output = await runCode(`

compute {
  check sole: Trivial
  return sole
}

`)

  expect(output).toMatchSnapshot()
})
