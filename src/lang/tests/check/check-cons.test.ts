import { expect, test } from "vitest"
import { runCode } from "../utils"

test("check Cons", async () => {
  await runCode(`

check cons(Type, Type): exists (Type) Type

`)
})

test("infer Cons to Pair if both car and cdr can be inferred", async () => {
  const output = await runCode(`

let pair = cons(cons(cons(Type, "Str1"), cons(sole, "Str1")), Type)
compute pair

`)

  expect(output).toMatchInlineSnapshot(
    '"cons(cons(cons(Type, \\"Str1\\"), cons(sole, \\"Str1\\")), Type): exists (exists (exists (Type) String, Trivial) String) Type"',
  )

  // throw new Error(output)
})
