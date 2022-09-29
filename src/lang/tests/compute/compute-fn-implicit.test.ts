import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute FnImplicit", async () => {
  const output = await runCode(`

let infer: (implicit T: Type, x: T) -> Type = (implicit T, x) => T
compute infer

`)

  expect(output).toMatchInlineSnapshot('"(implicit T, x) => T: (implicit T: Type, x: T) -> Type"')
})
