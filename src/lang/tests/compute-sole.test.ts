import { expect, test } from "vitest"
import { runCode } from "./utils"

test("compute sole", async () => {
  const output = await runCode(`

compute sole

`)

  expect(output).toMatchInlineSnapshot('"sole: Trivial"')
})
