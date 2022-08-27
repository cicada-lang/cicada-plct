import { expect, test } from "vitest"
import { Mod } from "../Mod"

test("check Fn", async () => {
  const mod = new Mod()
  await mod.run(`

check (T) => T: (Type) -> Type

`)
})

test("check Fn -- multiple bindings", async () => {
  const mod = new Mod()
  await mod.run(`

check (A, B) => A: (A: Type, B: Type) -> Type

`)
})

test("check Fn -- dependent", async () => {
  const mod = new Mod()
  await mod.run(`

check (A, a) => a: (A: Type, A) -> A

`)
})

test("check Fn -- dependent error", async () => {
  const mod = new Mod()
  await expect(
    mod.run(`

check (A, B) => A: (A: Type, A) -> A

`)
  ).rejects.toThrow()
})
