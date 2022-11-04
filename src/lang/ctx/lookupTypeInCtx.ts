import { Ctx } from "../ctx"
import { Value } from "../value"

export function lookupTypeInCtx(ctx: Ctx, name: string): Value | undefined {
  while (ctx.kind !== "CtxNull") {
    if (ctx.name === name) return ctx.type
    ctx = ctx.rest
  }

  return undefined
}
