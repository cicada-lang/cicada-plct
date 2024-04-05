import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Cdr", async () => {
  const output = await runCode(`

let pair: exists (Type) Type = cons(Type, Type)
compute cdr(pair)

`)

  expect(output).toMatchSnapshot()
})

test("compute Cdr -- just cdr", async () => {
  const output = await runCode(`

compute cdr

`)

  expect(output).toMatchSnapshot()
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

  expect(output).toMatchSnapshot()
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

  expect(output).toMatchSnapshot()
})
