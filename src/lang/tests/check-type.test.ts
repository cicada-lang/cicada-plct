import { test } from "vitest"
import { Mod } from "../Mod"

test("check Type in Type", async () => {
  const mod = new Mod()
  await mod.run(`

check Type: Type

`)
})

test("check Type in Type -- with Let", async () => {
  const mod = new Mod()
  await mod.run(`

let U = Type
check U: U

`)
})

test("check Type in Type -- with LetThe", async () => {
  const mod = new Mod()
  await mod.run(`

let U: Type = Type
check U: U

`)
})
