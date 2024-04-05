import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("equivalent Type", async () => {
  const output = await runCode(`

compute equivalent Type {
    Type
  = Type
}

`)

  expect(output).toMatchSnapshot()
})
