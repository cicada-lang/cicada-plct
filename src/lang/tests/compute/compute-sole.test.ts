import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Sole", async () => {
  const output = await runCode(`

compute sole

`)

  expect(output).toMatchInlineSnapshot('"sole: Trivial"')
})
