import { expect, test } from "vitest"
import { runCode } from "./utils"

test("compute car", async () => {
  const output = await runCode(`

let pair: exists (Type) Type = cons(Type, Type)
compute car(pair)

`)

  expect(output).toMatchInlineSnapshot('"Type: Type"')
})
