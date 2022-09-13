import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Cons", async () => {
  const output = await runCode(`

let pair: Pair(Type, Type)  = cons(Type, Type)
compute pair

`)

  expect(output).toMatchInlineSnapshot('"cons(Type, Type): exists (Type) Type"')
})

test("compute Cons -- inferred", async () => {
  const output = await runCode(`

let pair = cons(Type, Type)
compute pair

`)

  expect(output).toMatchInlineSnapshot('"cons(Type, Type): exists (Type) Type"')
})
