import { test } from "vitest"
import { runCode } from "./utils"

// need to add evaluator for Cons
test.todo("check car", async () => {
  await runCode(`

let pair: exists (Type) Type = cons(Type, Type)
check car(pair): Type

`)
})
