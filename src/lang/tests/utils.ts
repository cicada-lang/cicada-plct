import { expect } from "vitest"
import { Loader } from "../../loader"
import { LangError } from "../errors"
import { Mod } from "../mod"
import { parseStmts } from "../parse"

export async function runCode(code: string): Promise<string> {
  const loader = new Loader()
  const stmts = parseStmts(code)
  const mod = new Mod({ loader, url: new URL("test://") })
  await mod.executeStmts(stmts)
  const outputs = Array.from(mod.outputs.values())
  return outputs.join("\n")
}

export async function expectCodeToFail(code: string): Promise<void> {
  await expect(runCode(code)).rejects.toThrowError(LangError)
}
