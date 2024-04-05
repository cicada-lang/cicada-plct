import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("compute PiImplicit", async () => {
  const output = await runCode(`

compute (implicit T: Type, x: T) -> Type

`)

  expect(output).toMatchSnapshot()
})
