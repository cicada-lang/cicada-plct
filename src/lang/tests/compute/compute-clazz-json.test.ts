import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Clazz -- JSON", async () => {
  const output = await runCode(`

compute class { "Hello, World!": String }
compute class { "Hello, World!": String = "Hi!" }

`)

  expect(output).toMatchInlineSnapshot(`
    "class {
       \\"Hello, World!\\": String 
    }: Type
    class {
       \\"Hello, World!\\": String = \\"Hi!\\" 
    }: Type"
  `)
})
