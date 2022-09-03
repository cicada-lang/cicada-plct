import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute cdr", async () => {
  const output = await runCode(`

let pair: exists (Type) Type = cons(Type, Type)
compute cdr(pair)

`)

  expect(output).toMatchInlineSnapshot('"Type: Type"')
})
