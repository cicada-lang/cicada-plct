import { test } from "vitest"
import { runCode } from "../utils"

test("check Cons", async () => {
  await runCode(`

check cons(Type, Type): exists (Type) Type

`)
})

test("check Cons -- my_cons -- unification with postpone", async () => {
  await runCode(`

function my_cons(
  implicit A: Type,
  implicit B: (A) -> Type,
  x: A,
  y: B(x),
): exists (x: A) B(x) {
  return cons(x, y)
}

check my_cons("ratatouille", "baguette"): Pair(String, String)

`)
})
