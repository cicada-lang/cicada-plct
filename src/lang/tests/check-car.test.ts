import { test } from "vitest"
import { runCode } from "./utils"

test("check car", async () => {
  await runCode(`

let pair: exists (Type) Type = cons(Type, Type)
check car(pair): Type

`)
})
