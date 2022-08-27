import { test } from "vitest"
import { expectCodeToRun } from "./utils"

test("check Type in Type", async () => {
  await expectCodeToRun(`

check Type: Type

`)
})

test("check Type in Type -- with Let", async () => {
  await expectCodeToRun(`

let U = Type
check U: U

`)
})

test("check Type in Type -- with LetThe", async () => {
  await expectCodeToRun(`

let U: Type = Type
check U: U

`)
})
