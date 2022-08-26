import { test } from "vitest"
import { Mod } from "../Mod"

test("infer Var", async () => {
  const mod = new Mod()

  await mod.run(`

  declare t: Type
  check t: Type

  `)
})
