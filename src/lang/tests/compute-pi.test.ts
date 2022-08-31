import { expect, test } from "vitest"
import { runCode } from "./utils"

test("compute Pi", async () => {
  const output = await runCode(`

compute (T: Type, x: T) -> T

`)

  expect(output).toMatchInlineSnapshot('"(T: Type, x: T) -> T: Type"')
})
