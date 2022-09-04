import { test } from "vitest"
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
