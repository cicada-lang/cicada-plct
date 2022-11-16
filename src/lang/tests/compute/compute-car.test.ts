import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Car", async () => {
  const output = await runCode(`

let pair: exists (Type) Type = cons(Type, Type)
compute car(pair)

`)

  expect(output).toMatchInlineSnapshot('"Type: Type"')
})

test("compute Car -- just car", async () => {
  const output = await runCode(`

compute car

`)

  expect(output).toMatchInlineSnapshot(
    `
    "(implicit A, implicit B, target) => car(target): (
      implicit A: Type,
      implicit B: (A) -> Type,
      exists ((A)) B(x),
    ) -> A"
  `,
  )
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
