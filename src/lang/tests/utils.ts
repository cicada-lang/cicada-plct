import { expect } from "vitest"
import { Mod } from "../mod"
import { parseStmts } from "../parse"

export async function runCode(code: string): Promise<void> {
  const stmts = parseStmts(code)
  const mod = new Mod({ stmts })
  await mod.run()
}

export async function expectCodeToFail(code: string): Promise<void> {
  await expect(runCode(code)).rejects.toThrow()
}
