import { test } from "vitest"
import { runCode } from "../utils"

test("check Type in Type", async () => {
  await runCode(`

check Type: Type

`)
})

test("check Type in Type -- with Let", async () => {
  await runCode(`

let U = Type
check U: U

`)
})

test("check Type in Type -- with LetThe", async () => {
  await runCode(`

let U: Type = Type
check U: U

`)
})
