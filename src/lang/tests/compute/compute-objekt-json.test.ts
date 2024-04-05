import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("compute Objekt -- JSON", async () => {
  const output = await runCode(`

compute { "Hello, World!": "Hi!" }

`)

  expect(output).toMatchSnapshot()
})
