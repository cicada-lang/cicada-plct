import { test } from "vitest"
import { runCode } from "../utils"

test("equivalent Type", async () => {
  await runCode(`

equivalent Type [
  Type,
  Type,
]

`)
})
