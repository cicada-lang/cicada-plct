import { expect, test } from "vitest"
import { runCode } from "../utils.js"

test("solve String", async () => {
  const output = await runCode(`

solve () {
  String = String
}

`)

  expect(output).toMatchSnapshot()
})
