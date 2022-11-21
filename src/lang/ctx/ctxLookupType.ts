import type { Ctx } from "../ctx"
import type { Value } from "../value"

export function ctxLookupType(ctx: Ctx, name: string): Value | undefined {
  while (ctx["@kind"] !== "CtxNull") {
    if (ctx.name === name) return ctx.type
    ctx = ctx.rest
  }

  return undefined
}
