import { test } from "vitest"
import { runCode } from "./utils"

test("check cdr", async () => {
  await runCode(`

let pair: exists (Type) Type = cons(Type, Type)
check cdr(pair): Type

`)
})
