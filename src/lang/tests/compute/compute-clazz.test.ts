import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("compute Clazz", async () => {
  const output = await runCode(`

compute class { T: Type, x: T }
compute class { a: String, b: String, c: String }
compute class { a: String, b: String = "b", c: String }

`)

  expect(output).toMatchSnapshot()
})
