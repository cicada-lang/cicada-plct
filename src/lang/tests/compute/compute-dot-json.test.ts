import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Dot -- JSON", async () => {
  const output = await runCode(`

let hello = { "Hello, World!": "Hi!" }
compute hello["Hello, World!"]

`)

  expect(output).toMatchInlineSnapshot('"\\"Hi!\\": String"')
})
