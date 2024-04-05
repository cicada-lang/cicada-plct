import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("solve String", async () => {
  const output = await runCode(`

solve () {
  String = String
}

`)

  expect(output).toMatchSnapshot()
})
