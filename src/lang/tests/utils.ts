import { expect } from "vitest"
import { Loader } from "../../loader/index.js"
import * as Errors from "../errors/index.js"
import { Mod } from "../mod/index.js"
import { parseStmts } from "../syntax/index.js"

export async function runCode(code: string): Promise<string> {
  const loader = new Loader()
  const stmts = parseStmts(code)
  const mod = new Mod({ loader, url: new URL("test://") })
  await mod.executeStmts(stmts)
  const outputs = Array.from(mod.outputs.values())
  return outputs.join("\n")
}

interface ErrorConstructor {
  new (...args: any[]): Error
}

export async function expectCodeToFail(
  code: string,
  errorConstructor?: ErrorConstructor,
): Promise<void> {
  await expect(runCode(code)).rejects.toThrowError(
    errorConstructor ?? Errors.LangError,
  )
}
