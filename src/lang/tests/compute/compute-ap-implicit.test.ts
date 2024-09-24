import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute ApImplicit", async () => {
  const output = await runCode(`

let infer: (implicit T: Type, x: T) -> Type = (implicit T, x) => T
compute infer(implicit Trivial, sole)

`)

  expect(output).toMatchSnapshot()
})
