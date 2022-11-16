import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Cdr", async () => {
  const output = await runCode(`

let pair: exists (Type) Type = cons(Type, Type)
compute cdr(pair)

`)

  expect(output).toMatchInlineSnapshot('"Type: Type"')
})

test("compute Cdr -- just cdr", async () => {
  const output = await runCode(`

compute cdr

`)

  expect(output).toMatchInlineSnapshot(
    `
    "(implicit A, implicit B, target) => cdr(target): (
      implicit A: Type,
      implicit B: (A) -> Type,
      target: exists (A) B(x),
    ) -> B(car(target))"
  `,
  )
})

test("compute Cdr -- my_cdr", async () => {
  const output = await runCode(`

let cdrType = (
  implicit A: Type,
  implicit B: (x: A) -> Type,
  target: exists (x: A) B(x),
) -> B(car(target))


let my_cdr: cdrType = (implicit A, implicit B, target) => {
  return cdr(target)
}

compute my_cdr(cons("a", "b"))

`)

  expect(output).toMatchInlineSnapshot('"\\"b\\": String"')
})

test("compute Cdr -- my_cdr -- infer FnImplicitAnnotated", async () => {
  const output = await runCode(`

function my_cdr(
  implicit A: Type,
  implicit B: (x: A) -> Type,
  target: exists (x: A) B(x),
): B(car(implicit A, implicit B, target)) {
  return cdr(target)
}

compute my_cdr(cons("a", "b"))

`)

  expect(output).toMatchInlineSnapshot('"\\"b\\": String"')
})
