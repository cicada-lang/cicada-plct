import type { Ctx } from "../ctx/index.js"
import type { Value } from "../value/index.js"

export function ctxLookupValue(ctx: Ctx, name: string): Value | undefined {
  while (ctx["@kind"] !== "CtxNull") {
    if (ctx["@kind"] === "CtxCons" && ctx.name === name) return undefined
    if (ctx["@kind"] === "CtxFulfilled" && ctx.name === name) return ctx.value
    ctx = ctx.rest
  }

  return undefined
}
