import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute FnAnnotated", async () => {
  const output = await runCode(`

let id = (T: Type, x: T) => x

compute id(Type)

`)

  expect(output).toMatchInlineSnapshot('"(x2) => x2: (x2: Type) -> Type"')
})
