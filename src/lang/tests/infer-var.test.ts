import { expect, test } from "vitest"
import { Mod } from "../Mod"

test("infer Var", async () => {
  const mod = new Mod()
  await mod.run(`declare t: Type`)
  await mod.run(`check t: Type`)
})

test("infer Var -- fail to infer undefined variable", async () => {
  const mod = new Mod()
  await expect(mod.run(`check t: Type`)).rejects.toThrow()
})
