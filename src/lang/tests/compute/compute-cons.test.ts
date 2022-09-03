import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Cons", async () => {
  const output = await runCode(`

let pair: exists (Type) Type = cons(Type, Type)
compute pair

`)

  expect(output).toMatchInlineSnapshot('"cons(Type, Type): exists (Type) Type"')
})
