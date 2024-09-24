import { expect, test } from "vitest"
import { runCode } from "../utils.js"

test("compute Ap", async () => {
  const output = await runCode(`

let id: (T: Type, x: T) -> T = (T, x) => x
compute id(Type, Type)

`)

  expect(output).toMatchSnapshot()
})
