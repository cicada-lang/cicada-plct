import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Car", async () => {
  const output = await runCode(`

let pair: exists (Type) Type = cons(Type, Type)
compute car(pair)

`)

  expect(output).toMatchInlineSnapshot('"Type: Type"')
})

test("compute Car -- my_car", async () => {
  const output = await runCode(`

function my_car(
  implicit A: Type,
  implicit B: (x: A) -> Type,
  pair: exists (x: A) B(x),
): A {
  return car(pair)
}

compute my_car(cons("a", "b"))

`)

  expect(output).toMatchInlineSnapshot('"\\"a\\": String"')
})
