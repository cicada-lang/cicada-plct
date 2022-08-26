import { expect, test } from "vitest"
import { Mod } from "../Mod"

test("check Var", async () => {
  const mod = new Mod()
  await mod.run(`

declare t: Type
check t: Type

`)
})

test("check Var -- fail to check undefined variable", async () => {
  const mod = new Mod()
  await expect(
    mod.run(`

check t: Type

`)
  ).rejects.toThrow()
})
