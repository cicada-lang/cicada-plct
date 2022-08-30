import { test } from "vitest"
import { expectCodeToRun } from "./utils"

test("check Cons", async () => {
  await expectCodeToRun(`

check cons(Type, Type): exists (Type) Type

`)
})
