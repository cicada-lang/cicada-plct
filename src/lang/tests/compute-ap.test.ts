import { test } from "vitest"
import { runCode } from "./utils"

test("compute Ap", async () => {
  await runCode(`

let id: (T: Type, x: T) -> T = (T, x) => x
compute id(Type, Type)

`)
})
