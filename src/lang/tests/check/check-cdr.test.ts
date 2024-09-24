import { test } from "vitest"
import { runCode } from "../utils.js"

test("check Cdr", async () => {
  await runCode(`

let pair: exists (Type) Type = cons(Type, Type)
check cdr(pair): Type

`)
})
