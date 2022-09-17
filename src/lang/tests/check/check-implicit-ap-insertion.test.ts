import { test } from "vitest"
import { runCode } from "../utils"

test.todo("check ImplicitAp -- insertion", async () => {
  await runCode(`

function id(implicit T: Type, x: T): T {
  return x
}

`)
})
