import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Cdr", async () => {
  const output = await runCode(`

let pair: exists (Type) Type = cons(Type, Type)
compute cdr(pair)

`)

  expect(output).toMatchInlineSnapshot('"Type: Type"')
})

test("compute Cdr -- my_cdr", async () => {
  const output = await runCode(`

function my_cdr(
  implicit A: Type,
  implicit B: (x: A) -> Type,
  pair: exists (x: A) B(x),
): B(car(pair)) {
  return cdr(pair)
}


compute my_cdr(cons("a", "b"))

`)

  expect(output).toMatchInlineSnapshot('"\\"b\\": String"')
})
