import { test } from "vitest"
import { Mod } from "../Mod"

test("check Pi is a Type", async () => {
  const mod = new Mod()
  await mod.run(`

check (A: Type) -> Type: Type

`)
})

test("check Pi is a Type -- multiple bindings", async () => {
  const mod = new Mod()
  await mod.run(`

check (A: Type, B: Type) -> Type: Type

`)
})

test("check Pi is a Type -- nested", async () => {
  const mod = new Mod()
  await mod.run(`

check (A: Type, F: (A: Type) -> Type) -> Type: Type

`)
})
