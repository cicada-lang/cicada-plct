import { test } from "bun:test"
import { runCode } from "../utils"

test("check Pair is a Type", async () => {
  await runCode(`

check Pair(Type, Type): Type

`)
})

test("check cons is Pair", async () => {
  await runCode(`

check cons(sole, sole): Pair(Trivial, Trivial)

`)
})

test("infer Cons to Pair if both car and cdr can be inferred", async () => {
  await runCode(`

let abc = cons("a", cons("b", "c"))
check abc: Pair(String, Pair(String, String))

`)
})
