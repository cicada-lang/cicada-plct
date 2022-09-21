import { expect, test } from "vitest"
import { runCode } from "../utils"

/**
   TODO We need to design a failing test, before we try to fix `inferApPiImplicit`.
**/

test("compute ApImplicit -- Scope", async () => {
  const output = await runCode(`

let A: Type = String
let A1: Trivial = sole

function twins(implicit A: Type, A1: A): Pair(A, A) {
  return cons(A1, A1)
}

compute twins("1")
compute twins(A)
compute twins(A1)

`)

  expect(output).toMatchInlineSnapshot(`
    "cons(\\"1\\", \\"1\\"): exists (String) String
    cons(String, String): exists (Type) Type
    cons(sole, sole): exists (Trivial) Trivial"
  `)
})
