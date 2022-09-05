import { test } from "vitest"
import { runCode } from "../utils"

test("conversion Type", async () => {
  await runCode(`

conversion Type {
  Type
  Type
}

`)
})
