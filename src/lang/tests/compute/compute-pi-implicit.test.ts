import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute PiImplicit", async () => {
  const output = await runCode(`

compute (implicit T: Type, x: T) -> Type

`)

  expect(output).toMatchSnapshot()
})
