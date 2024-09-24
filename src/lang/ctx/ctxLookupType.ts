import type { Ctx } from "../ctx/index.js"
import type { Value } from "../value/index.js"

export function ctxLookupType(ctx: Ctx, name: string): Value | undefined {
  while (ctx["@kind"] !== "CtxNull") {
    if (ctx.name === name) return ctx.type
    ctx = ctx.rest
  }

  return undefined
}
