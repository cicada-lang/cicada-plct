import { expect, test } from "vitest"
import { runCode } from "../utils.js"

test("equivalent Type", async () => {
  const output = await runCode(`

compute equivalent Type {
    Type
  = Type
}

`)

  expect(output).toMatchSnapshot()
})
