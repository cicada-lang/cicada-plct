import { test } from "bun:test"
import { runCode } from "../utils"

test("check Cdr", async () => {
  await runCode(`

let pair: exists (Type) Type = cons(Type, Type)
check cdr(pair): Type

`)
})
