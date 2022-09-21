import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute AnnotatedFn", async () => {
  const output = await runCode(`

let id = (T: Type, x: T) => x

compute id(Type)

`)

  expect(output).toMatchInlineSnapshot('"(x1) => x1: (x1: Type) -> Type"')
})
