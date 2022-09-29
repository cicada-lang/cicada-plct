import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute FnImplicit", async () => {
  const output = await runCode(`

let infer: (implicit T: Type, x: T) -> Type = (implicit T, x) => T
compute infer

`)

  expect(output).toMatchInlineSnapshot(
    '"(implicit T2, x11) => T2: (implicit T2: Type, x11: T2) -> Type"',
  )
})
