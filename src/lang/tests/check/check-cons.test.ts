import { test } from "vitest"
import { runCode } from "../utils"

test("check Cons", async () => {
  await runCode(`

check cons(Type, Type): exists (Type) Type

`)
})
