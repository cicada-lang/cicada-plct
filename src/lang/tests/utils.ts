import { expect } from "vitest"
import { Mod } from "../mod"

export async function expectCodeToRun(code: string): Promise<void> {
  const mod = new Mod()
  await mod.run(code)
}

export async function expectCodeToFail(code: string): Promise<void> {
  const mod = new Mod()
  await expect(mod.run(code)).rejects.toThrow()
}
